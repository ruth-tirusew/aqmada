import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import { InvoiceType } from "@/app/[locale]/types";

import {generateRefNumber} from "@/app/lib/utils/generateRefNumber"

export async function POST(request: Request) {
    const body = await request.json();
    let { vendor, order_number,file, items } = body;
     if (!order_number){
      order_number = generateRefNumber("PO")
     }
     for (const item of items) {
      if(item.id === ''){
        return NextResponse.json({message:`Please select an item`}, { status: 400 }) 
      }
    }
    try {
        const vendor_input = await db.vendor.create({
          data: {
            name: vendor,
          },
        });
        vendor = vendor_input.id;
      
       const purchase = await db.purchase.create({
        data: {
            vendor_id: vendor_input?.id, 
            order_number,
            file
        },
      });
      const purchaseInventoryData = items.map((item: any) => {
        return {
          inventory_id: item.id,
          purchase_id: purchase.id,
          quantity: item.quantity,
          price: item.initial_price,
        };
      });
  
      await db.purchaseItem.createMany({
        data: purchaseInventoryData,
      });
  
      for (const item of items) {
        await db.item.update({
          where: { id: item.id },
          data: { quantity: { increment: item.quantity } },
        });
      }

      return NextResponse.json(purchase);
    } catch (error) {
      console.error('Error creating purchase:', error);
      return NextResponse.error();
    }
  }
  

  interface InvoiceParams {
    id?: string;
    customer_name?: string;
  }
  
  export async function GET(request: NextRequest, params?: InvoiceParams): Promise<NextResponse> {
    const { id, customer_name } = params || {};
    const queryOptions: any = {
      include: {
        inventory: true,
      },
    };
  
    if (id) {
      queryOptions.where = {
        id: id,
      };
    }
  
    if (customer_name) {
      queryOptions.where = {
        ...queryOptions.where,
        customer_name,
      };
    }
  
    const items = await db.invoice.findMany(queryOptions);
    return NextResponse.json(items);
  }


