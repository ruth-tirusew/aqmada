import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { db } from "@/app/lib/db";

async function linkAccount(profile: any) {
  try {
    const user = await db.user.findUnique({
      where: { email: profile.email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = await db.account.findFirst({
      where: {
        userId: user.id,
        provider: "google",
      },
    });
    if (!account) {
      db.account.create({
        data: {
          userId: user.id,
          provider: "google",
          providerAccountId: profile.id,
          type: profile.type,
          access_token: profile.accessToken,
          refresh_token: profile.refreshToken,
          expires_at: profile.expiresAt,
          token_type: profile.tokenType,
          scope: profile.scope,
          id_token: profile.idToken,
        },
      });
    }

    return user;
  } catch (error) {
    throw new Error("User not found");
  }
}
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
       return linkAccount(profile);
      },
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await db.user.findUnique({
          where: { email: credentials?.email as string },
        });

        if (!user) {
          throw new Error("Invalid email or password");
        }
        try {
          const isValid = await bcrypt.compare(
            credentials?.password as string,
            user?.password as string
          );
          if (!isValid) {
            throw new Error("Invalid email or password");
          }
        } catch (error) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  //   callbacks: {
  //     async session({ session, token, user }) {
  //       session.user.id = user.id;
  //       return session;
  //     },
  //   },

  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // jwt: {
  //   secret: process.env.AUTH_SECRET_KEY,
  // },
  debug: process.env.NODE_ENV === "development",
};

export default NextAuth(authOptions);
