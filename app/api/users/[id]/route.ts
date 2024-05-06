import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { hasPermission } from "@/app/lib/utils/authorize";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
    try{
    const {id} = params;

    const body = await request.json();
    const { email, name, password, role } = body;
    const loggedUser = await getCurrentUser()
    if (!loggedUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const isAllowed = await hasPermission("UPDATE", "User")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to update users"}, { status: 403 })
    }



    // Check if email already exists
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser?.id !== id) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    const user = await db.user.update({
      where: { id: id },
      data: {
        email,
        name,
        company_id: loggedUser.company_id,
        roleId: role
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'An error occurred while creating the user' }, { status: 500 });
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try{
    const user = await getCurrentUser();
    
  
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!user.company_id){
      return new NextResponse("No company found", { status: 400 });;
      }
    const employees = await db.user.findUnique({
      where: { 
        id: params.id,
        company_id: user.company_id 
      },
    });
    return new NextResponse(JSON.stringify(employees)) 
  }catch(e:any){
    return new NextResponse(e.message, { status: 500 });
  }
}
