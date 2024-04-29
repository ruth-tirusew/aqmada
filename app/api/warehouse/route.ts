import { NextResponse } from "next/server";


import { db } from "@/app/lib/db";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { WarehouseType } from "@/app/[locale]/types";


export async function GET(request: Request){
    // Get the current user
    const user = await getCurrentUser();
    if (user?.company_id){

        const warehouses = await db.warehouse.findMany({
            where:{
                company_id: user?.company_id
            }
        })
        const safeWarehouse =  warehouses.map((warehouse) => {
            return {
              ...warehouse,
              created_at: warehouse.created_at.toString(),
              updated_at: warehouse.updated_at.toString(),
            };
          });
        return NextResponse.json(safeWarehouse)
    }
    return NextResponse.json([]); 
}
