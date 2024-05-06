import { NextResponse } from "next/server";


import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { hasPermission } from "@/app/lib/utils/authorize";

export async function POST(request: Request) {
    const isAllowed = await hasPermission("CREATE", "Warehouse")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to create warehouse"}, { status: 403 })
    }
    try{
        const user = await getCurrentUser()
        const body = await request.json();
        
    
        const {name, location} = body
    
        const warehouse = await db.warehouse.create({
            data: {
            name,
            location,
            company_id: user?.company_id || "",
            }
        })
        return NextResponse.json(warehouse)
    }
    catch(error:any){
        return NextResponse.json({error: error.message, status: 500})
    }
    }



