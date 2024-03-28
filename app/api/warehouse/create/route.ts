import { NextResponse } from "next/server";


import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
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
        console.log(warehouse)
        return NextResponse.json(warehouse)
    }
    catch(error:any){
        return NextResponse.json({error: error.message, status: 500})
    }
    }



