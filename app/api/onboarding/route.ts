import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";


export async function POST(request: Request) {
  const {
    company,
    warehouse,
    user,
  } = await request.json();
  try{
    const user_data = await db.user.findUnique({
      where: {
        email: user
      }
    }) 

    const company_data = await db.company.create({
      data: {
        name: company.name,
        size: company.size,
        industry: company.industry,
        location: company.location,
        users: {
          connect: {
            id: user_data?.id
          }
        },
        warehouse: {
          create: {
            name: warehouse.name,
            location: warehouse.location
      }}
    }});

    const adminRole = {
      name: "admin",
      permissionModels: {
        create: [
          {
            model: "Warehouse",
            permission: ["CREATE",  "UPDATE", "DELETE"]
          },
          {
            model: "Inventory",
            permission: ["CREATE", "UPDATE", "DELETE"]
          },
          {
            model: "User",
            permission: ["CREATE", "UPDATE", "DELETE"]
          },
          {
            model: "Invoice",
            permission: ["CREATE", "UPDATE", "DELETE"]
          },
          {
            model: "Purchase",
            permission: ["CREATE",  "UPDATE", "DELETE"]
          }
        ]
      }
    }
    const role = await db.role.create({
      data: {
        name: "Admin",
        company_id:company_data.id
      }
    })

    await db.permissionModels.createMany({
      data: [
        {
          model: "Warehouse",
          roleId:role.id,
          permission: ["CREATE",  "UPDATE", "DELETE"]
        },
        {
          model: "Inventory",
          roleId:role.id,
          permission: ["CREATE",  "UPDATE", "DELETE"]
        },
        {
          model: "User",
          roleId:role.id,
          permission: ["CREATE",  "UPDATE", "DELETE"]
        },
        {
          model: "Invoice",
          roleId:role.id,
          permission: ["CREATE",  "UPDATE", "DELETE"]
        },
        {
          model: "Purchase",
          roleId:role.id,
          permission: ["CREATE",  "UPDATE", "DELETE"]
        }
      ]
    })

    await db.user.update({
      where:{
        email: user
      },
      data:{
        roleId:role.id
      }
    })
    return NextResponse.json({
      company_data 
    }, {
      status: 200,
    })
  }catch(error: any){
    return NextResponse.json({message:"Something went wrong", status:500})
}
}

