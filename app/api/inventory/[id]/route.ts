import { NextResponse, NextRequest } from "next/server";
import { db } from "@/app/lib/db";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    console.log(request)
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
            console.log(inventory);
            return new NextResponse(JSON.stringify(inventory), { status: 200 });
        }
    } catch (error) {
        console.log(error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params;
    try {
        if (!id) {
            return NextResponse.next();
        }
        console.log(id)
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
        console.log(error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}



export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    const {id} = params;
    try {
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
            console.log(error);
            return new NextResponse("Something went wrong", { status: 500 });
        }
}