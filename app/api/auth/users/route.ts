import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try{
      const user = await getCurrentUser();
    
      if (!user) {
        return new NextResponse("Unauthorized", { status: 401 });
      }
      if(!user.company_id){
        return new NextResponse("No company found", { status: 400 });;
        }
      const employees = await db.user.findMany({
        where: { company_id: user.company_id },
      });
      return new NextResponse(JSON.stringify(employees)) 
    }catch(e:any){
      return new NextResponse(e.message, { status: 500 });
    }
  }

  