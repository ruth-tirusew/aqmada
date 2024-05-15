import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";
import {hasPermission} from "@/app/lib/utils/authorize";


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) {
            return NextResponse.next();
        }
        if (request.method === "GET") {
            const inventory = await db.item.findUnique({
                where: {
                    id,
                },
            });
            return new NextResponse(JSON.stringify(inventory), { status: 200 });
        }
    } catch (error) {
        return new NextResponse("Something went wrong", { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params;
    const isAllowed = await hasPermission("DELETE", "Inventory")
    if(!isAllowed) return new NextResponse("Unauthorized", { status: 403 })
    try {
        if (!id) {
            return NextResponse.next();
        }
        if (request.method === "DELETE") {
            await db.item.delete({
                where: {
                    id: id,
                  },
            });
            
            return new NextResponse("Deleted", { status: 200 });
        }
    }
    catch (error) {
        return new NextResponse("Something went wrong", { status: 500 });
    }
}



export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params;
    try {
        const isAllowed = await hasPermission("UPDATE", "Inventory")
        if(!isAllowed) return new NextResponse("Unauthorized", { status: 403 })

        const { image, name, description, quantity, initial_price, warehouse_id } = await request.json();
        if (!id) {
            return NextResponse.next();
        }
        if (request.method === "PUT"){
            await db.item.update({
                where: {
                    id: id,
                  },
                  data: {
                    image: image,
                    name: name,
                    description: description,
                    quantity: quantity,
                    initial_price: initial_price,
                    warehouse_id: warehouse_id
                  }
                })
            }
            return new NextResponse("Updated", { status: 200 });

        }
        catch (error) {
            return new NextResponse("Something went wrong", { status: 500 });
        }
}