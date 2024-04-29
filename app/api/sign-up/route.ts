import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { db } from "@/app/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, password } = body;

    console.log(body);

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
      },
    });

    console.log(user);
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
  }
}