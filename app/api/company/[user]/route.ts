import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { user: string } }) {
    const {user} = params;
    if(!user) return new NextResponse("Email is required", { status: 400 } )
    try {
        const company = await db.company.findFirst({
            where: {
                users:{
                    some: {
                        email: user
                    }
                }
            }
        });
        return new NextResponse(JSON.stringify(company), { status: 200 });
    }
    catch (error) {
        console.log(error);
        return new NextResponse("Something went wrong", { status: 500 });
    }
}

