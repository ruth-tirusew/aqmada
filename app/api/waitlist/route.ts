import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;
  // const loggedUser = await getCurrentUser()
  try{
    const existingUser = await db.user.findUnique({
      where:{
        email:email
      }
    })
    if(existingUser){
      return NextResponse.json({error: "Email is already registered."}, {status: 400});
    }
    const user = await db.waitlist.create({
      data: {
        email,
      },
    });
    return NextResponse.json(user);
  }catch(error:any){
    if (error.code === "P2002") {
      const er = new Error("Email is already registered.");
      return NextResponse.json({error: "Email is already registered."}, {status: 400});
    }
    return NextResponse.json({error: "Something went wrong."}, {status: 500});
  }

}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if(!user.isSuperuser){
    return NextResponse.json({ error: "User not authorized" }, { status: 403 });
  }
  const waitlist = await db.waitlist.findMany();
  return NextResponse.json(waitlist);
}