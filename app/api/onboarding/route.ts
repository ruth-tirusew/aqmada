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
    
    return NextResponse.json({
      company_data 
    }, {
      status: 200,
    })
  }catch(error: any){
    return NextResponse.json({message:"Something went wrong", status:500})
}
}

