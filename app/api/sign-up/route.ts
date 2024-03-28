import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { db } from "@/app/lib/db";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, name, password } = body;

  console.log(body);

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
}