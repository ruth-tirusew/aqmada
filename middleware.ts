
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "next-auth/react";
import { NextURL } from "next/dist/server/web/next-url";

import { db } from "./app/lib/db";


export { default } from "next-auth/middleware"
export const config = { matcher: ["/dashboard", "/dashboard/:path*", "/onboarding", "/onboarding/:path*"] }

// export async function middleware(req: NextRequest, res: NextResponse) {
//   const session = await getSession();
//   const email = session?.user?.email;
//   if(!session) {
//     const url = new NextURL("/login", req.url);
//     return NextResponse.redirect(url);
//   } 
//   if (email) {
//     const user = await db.user.findUnique({
//       where: {
//         email,
//       },
//     });

//     if (user?.company_id !== null) {
//       const url = new NextURL("/", req.url);
//       return NextResponse.redirect(url);
//     } else {
//       const url = new NextURL("/onboarding", req.url);
//       return NextResponse.redirect(url);
//     }
//   }

//   return NextResponse.next();
// }
