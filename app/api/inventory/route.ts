import { NextResponse } from "next/server";


import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
    const body = await request.json();
    const { image, name, description, quantity, initial_price, warehouse_id } = body;
    const user = await getCurrentUser();
  
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const warehouse = await db.warehouse.findUnique({
      where: {
        id: warehouse_id,
        company_id: user.company_id || ""
      },
    });


    if (!warehouse) {
      return new NextResponse("Warehouse Not Found", { status: 404 });
    }
  
  
    const item = await db.item.create({
      data: {
        warehouse_id,
        image,
        description,
        name,
        quantity,
        initial_price
      },
    });
  
    console.log(item);
    return NextResponse.json(item);
  }

export async function GET(request: Request) {
  try{
    const user = await getCurrentUser();
  
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if(!user.company_id){
      return new NextResponse("No company found", { status: 400 });;
      }
    const warehouses = await db.warehouse.findMany({
      where: {
        company_id: user.company_id
      },
    });

    const items = await db.item.findMany(
      {
        
      where: {
        warehouse_id: {
          in: warehouses.map((warehouse) => warehouse.id),
        },
      },
      }
    );
    const safeItems = items.map((item) =>{
      return({
        ...item,
        created_at: item.created_at.toISOString(),
        updated_at: item.updated_at.toISOString()
      })
    })
    return NextResponse.json(safeItems, { status: 200 });
  } catch (error) {
  console.log(error);
  return new NextResponse("Something went wrong", { status: 500 });
}
}
