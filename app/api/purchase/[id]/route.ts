import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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