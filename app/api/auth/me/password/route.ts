import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";


export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const {password} = await request.json();
    const saltRounds = 12; 
    const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);


    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        password:hashedPassword,
        passwordChanged: true
      },
    });

    return new NextResponse(JSON.stringify(updatedUser));
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}