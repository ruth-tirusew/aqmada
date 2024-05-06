import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { InvoiceItem } from "@prisma/client";
import { hasPermission } from "@/app/lib/utils/authorize";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const isAllowed = await hasPermission("DELETE", "Purchase")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to delete purchase"}, { status: 403 })
    }
    try {
        const { id } = params
         await db.purchaseItem.delete({
            where: {
                id: id
            }
        })
       
  
        return NextResponse.json({
            message: "Purchase Item  deleted successfully",
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
  }