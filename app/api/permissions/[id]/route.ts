import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import { hasPermission } from "@/app/lib/utils/authorize";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.next();
        }
        if (request.method === "GET") {
            const permission = await db.role.findUnique({
                where: {
                    id,
                },
                include:{
                    permissionModels:true
                }
            });
            console.log(permission);
            return new NextResponse(JSON.stringify(permission), { status: 200 });
        }
    } catch (error) {
        return new NextResponse("Something went wrong", { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params;
    try {
        const isAllowed = await hasPermission("DELETE", "User")
        if(!isAllowed){
          return NextResponse.json({message:"You are not allowed to delete user."}, { status: 403 })
        }
        if (!id) {
            return NextResponse.next();
        }
        if (request.method === "DELETE") {
            await db.role.delete({
                where: {
                    id: id,
                  },
            });
            
            await db.permissionModels.deleteMany({
                where:{
                    roleId:id
                }
            })
            return new NextResponse("Deleted", { status: 200 });
        }
    }
    catch (error) {
        return new NextResponse("Something went wrong", { status: 500 });
    }
}


export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        // const isAllowed = await hasPermission("UPDATE", "User")
        // if(!isAllowed){
        //   return NextResponse.json({message:"You are not allowed to create invoice"}, { status: 403 })
        // }
        const { role, permissions } = await request.json();
        if (!id) {
            return new NextResponse("Invalid ID", { status: 400 });
        }

        await db.$transaction(async (prisma) => {
            // Update role name
            await prisma.role.update({
                where: { id: id },
                data: { name: role }
            });

            // Process permissions using upsert
            await Promise.all(permissions.map(async (permission: any) => {
                const { id: permissionId, model, permission: permissionsData } = permission;
                await prisma.permissionModels.upsert({
                    where: { id: permissionId },
                    update: {
                        model,
                        permission: permissionsData
                    },
                    create: {
                        roleId: id,
                        model,
                        permission: permissionsData
                    }
                });
            }));
        });

        return new NextResponse("Updated", { status: 200 });
    } catch (error) {
        console.error("Error:", error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}
