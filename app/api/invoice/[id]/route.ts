import { NextRequest, NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { InvoiceItem } from "@prisma/client";
import { hasPermission } from "@/app/lib/utils/authorize";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const invoice = await db.invoice.findUnique({
    where: {
      id: id,
    },
    include: {
      items: {
        include:{
          item:true
        }
      }
    },
  });

  if (!invoice) {
    return new Response("Not Found", { status: 404 });
  }

  return NextResponse.json(invoice);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const isAllowed = await hasPermission("DELETE", "Invoice")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to create invoice"}, { status: 403 })
    }
      const { id } = params
       await db.invoiceItem.deleteMany({
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

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const isAllowed = await hasPermission("UPDATE", "Invoice")
  if(!isAllowed){
    return NextResponse.json({message:"You are not allowed to create invoice"}, { status: 403 })
  }
  const { id } = params;
  try {
    const body = await request.json();
    if (!id) {
      return NextResponse.next();
    }
    const existingInvoice = await db.invoice.findUnique({where:{id:id}, include:{items:true}})

    if(!existingInvoice){
    return new NextResponse("Invoice Not Found", { status: 404 }); 
    }

    if(body !== null){
      const invoiceUpdate = db.invoice.update({
        where:{id:id},
        data:{
          customer_name:body.customer_name
        },
        include:{
          items:true
        }
      })

      // if(body.items.length < existingInvoice.items.length){
      //   existingInvoice.items.map(async (item: InvoiceItem) => {
      //     if (!body.items.includes(item)) {
      //       await db.invoiceItem.delete({
      //         where: { id: item.id },
      //       });
      //     }
          
      //   });
      // }

      body.items.map(async (item: InvoiceItem) => {
        if (item.id) {
          return await db.invoiceItem.update({
            where: { id: item.id },
            data: {
              inventory_id: item.inventory_id,
              invoice_id: id,
              quantity: item.quantity,
              selling_price:item.selling_price
            },
          });
        }
       else {
          return await db.invoiceItem.create({
            data: {
              inventory_id: item.inventory_id,
              invoice_id: id,
              quantity: item.quantity,
              selling_price:item.selling_price
            },
          });
        }
      })
    }

    return new NextResponse("Invoice Update Sucessfull", { status: 200 });

  } catch (error) {
    console.log(error);
    return new NextResponse("Something went wrong", { status: 500 });
  }
}