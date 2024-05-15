import { NextResponse } from "next/server";


import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { PermissionEnum } from "@prisma/client";
import { hasPermission } from "@/app/lib/utils/authorize";

export async function POST(request: Request) {
  try{
    const isAllowed = await hasPermission("CREATE", "User")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to create user permission"}, { status: 403 })
    }
    const body = await request.json();
    const user = await getCurrentUser();
    const { role, permissions } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!user.company_id){
      return new NextResponse("No company found", { status: 400 });;
      }
  
    const createdRole = await db.role.create({
      data: {
        name:role,
        company_id:user?.company_id
      },
    });
    await Promise.all(permissions.map(async (permission: any) => {
      await db.permissionModels.create({
        data:{
          model:permission.model,
          roleId:createdRole.id,
          permission: permission.permission as PermissionEnum[],
        }
      })
    }))
    return NextResponse.json(createdRole);
  }catch (error) {
    return new NextResponse("Something went wrong", { status: 500 });
  }
  }

export async function GET(request: Request) {
  try{
    const user = await getCurrentUser();
  
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!user.company_id){
      return new NextResponse("No company found", { status: 400 });;
      }

    const roles = await db.role.findMany(
      {
        
      where: {
        company_id: user.company_id
      },
      }
    );
    // const safeRoles = roles.map((role) =>{
    //   return({
    //     ...roles,
    //     created_at: role.created_at.toISOString(),
    //     updated_at: role.updated_at.toISOString()
    //   })
    // })
    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
  return new NextResponse("Something went wrong", { status: 500 });
}
}
