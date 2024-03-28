import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { Invoice } from "@/app/types";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const invoice = await db.invoice.findUnique({
    where: {
      id: id,
    },
    include: {
      inventory: {
        include: {
          item : true
        }
      },
    },
  });

  if (!invoice) {
    return new Response("Not Found", { status: 404 });
  }

  console.log(invoice);
  return NextResponse.json(invoice);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
      const { id } = params
       await db.itemInvoice.deleteMany({
          where: {
              invoice_id: id
          }
      })
      const purchase = await db.invoice.delete({
          where: {
              id: id
          }
      })

      return NextResponse.json({
          message: "Purchase deleted successfully",
          data: purchase
      })
  } catch (error) {
      return NextResponse.json({
          message: "Something went wrong",
          error
      })
  }
}