import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import { generateRefNumber } from "@/app/lib/utils/generateRefNumber";
import getCurrentUser from "@/app/actions/getCurrentUser";




export async function POST(request: Request) {
    const body = await request.json();
    const { customer_name, payment_status, inventory_items } = body;
    const user = await getCurrentUser()
    if(!user){
      return NextResponse.json({message:"You are not logged in"}, { status: 401 })
    }
  
    try {
      const ref_number = generateRefNumber("inv");
      for (const item of inventory_items){
        const inventory = await db.item.findUnique({
          where: { id: item.inventory_id },
        });
       const available_quantity = inventory?.quantity? inventory.quantity : 0
       const requested_quantity = Number(item.quantity)

      // ts.ignore
       if (available_quantity < requested_quantity ){
        return NextResponse.json({message:`Only ${available_quantity} ${inventory?.name} are available`}, { status: 400 }) 
       }
      }
  
      const invoice = await db.invoice.create({
        data: {
          ref_number,
          customer_name,
          payment_status,
          company_id : user.company_id || "",
        },
      });
      const inventoryInvoiceData = inventory_items.map((item: any) => {
        return {
          inventory_id: item.inventory_id,
          invoice_id: invoice.id,
          quantity: item.quantity,
          selling_price:item.selling_price
        };
      });
  
      await db.invoiceItem.createMany({
        data: inventoryInvoiceData,
      });
  
      for (const item of inventory_items) {
        await db.item.update({
          where: { id: item.inventory_id },
          data: { quantity: { decrement: item.quantity } },
        });
      }
      return NextResponse.json(invoice);
    } catch (error) {
      console.error('Error creating invoice:', error);
      return NextResponse.error();
    }
  }
  
  export async function GET(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ message: "You are not logged in" }, { status: 401 });
    }
    const queryOptions: any = {
      where: {
          company_id: user?.company?.id
      },
      include: {
        items: {
          include: {
            item: true
          }

        },
      },
      orderBy: {
        created_at: "desc",
      },
    };
  
    const items = await db.invoice.findMany(queryOptions);
    const safeItems = items.map((item)=>{
      return({
        ...item,
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString(),
      })
    })

    return NextResponse.json(safeItems);
  }