import { NextRequest, NextResponse } from "next/server";

import { db } from "@/app/lib/db";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params
        const waitlist = await db.waitlist.delete({
            where: {
                id: id
            }
        })


        return NextResponse.json({
            message: "Waitlisted User deleted successfully",
            data: waitlist
        })
    } catch (error) {
        return NextResponse.json({
            message: "Something went wrong",
            error
        })
    }
}