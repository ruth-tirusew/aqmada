import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { InvoiceItem } from "@prisma/client";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
         await db.invoiceItem.delete({
            where: {
                id: id
            }
        })
       
  
        return NextResponse.json({
            message: "Purchase deleted successfully",
            status: 200
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
  }