import { getServerSession } from "next-auth/next"

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { db } from "@/app/lib/db";

export async function getSession() {
  return await getServerSession(authOptions)
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await db.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      include:{
        company: true,
        role: true
      }
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.created_at.toISOString(),
      updatedAt: currentUser.updated_at.toISOString(),
    }
  } catch (error: any) {
    return null;
  }
}

