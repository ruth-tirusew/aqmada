import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { InvoiceItem } from "@prisma/client";
import { hasPermission } from "@/app/lib/utils/authorize";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const isAllowed = await hasPermission("UPDATE", "Invoice")
        if(!isAllowed){
          return NextResponse.json({message:"You are not allowed to create invoice"}, { status: 403 })
        }
        const { id } = params
         await db.invoiceItem.delete({
            where: {
                id: id
            }
        })
       
  
        return NextResponse.json({
            message: "Invoice item deleted successfully",
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
  }