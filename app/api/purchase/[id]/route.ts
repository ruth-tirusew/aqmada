import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import { PurchaseItem } from "@prisma/client";
import { hasPermission } from "@/app/lib/utils/authorize";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const isAllowed = await hasPermission("DELETE", "Purchase")
    if(!isAllowed){
      return NextResponse.json({message:"You are not allowed to delete purchase"}, { status: 403 })
    }
    try {
        const { id } = params
        const purchaseItems = await db.purchaseItem.deleteMany({
            where: {
                purchase_id: id
            }
        })
        const purchase = await db.purchase.delete({
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    const purchase = await db.purchase.findUnique({
      where: {
        id: id,
      },
      include: {
        inventory: {
          include:{
            item:true
          }
        },
        vendor:true
      },
    });
  
    if (!purchase) {
      return new Response("Not Found", { status: 404 });
    }
  
    return NextResponse.json(purchase);
}




export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params;
  const isAllowed = await hasPermission("UPDATE", "Purchase")
  if(!isAllowed){
    return NextResponse.json({message:"You are not allowed to update purchase"}, { status: 403 })
  }
  try {
    const body = await request.json();
    if (!id) {
      return NextResponse.next();
    }
    const existingInvoice = await db.purchase.findUnique({where:{id:id}, include:{inventory:true}})

    if(!existingInvoice){
    return new NextResponse("Invoice Not Found", { status: 404 }); 
    }
    console.log(body)
    if(body !== null){
      let data = {}
      console.log(body)
      if(existingInvoice.vendor_id !== null){
        data ={
          order_number:body.order_number,
          file: body.file,
          vendor:{
            update:{
              where:{id:existingInvoice.vendor_id},
              data:{name:body.vendor}
          }
          }
        }
      }else{
        data ={
          order_number:body.order_number,
          file: body.file,
        }
      }
      const purchaseUpdate = await db.purchase.update({
        where:{id:id},
        data:data,
        include:{
          inventory:true
        }
        })

      // if(body.vendor){
      //   purchaseUpdate.vendor = body.vendor
      // }
      console.log(purchaseUpdate)


      body.items.map(async (item: PurchaseItem) => {
        console.log(item)
        if (item.id) {

        }
       else {
          return await db.purchaseItem.create({
            data: {
              inventory_id: item.inventory_id,
              purchase_id: id,
              quantity: item.quantity,
              price: item.price
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