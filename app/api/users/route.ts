import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { hasPermission } from "@/app/lib/utils/authorize";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;
    const loggedUser = await getCurrentUser()
    if (!loggedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // const isAllowed = await hasPermission("CREATE", "User")
    // if(!isAllowed){
    //   return NextResponse.json({message:"You are not allowed to create invoice"}, { status: 403 })
    // }



    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        company_id: loggedUser.company_id,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
  }
}