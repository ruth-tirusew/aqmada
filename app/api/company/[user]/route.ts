import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { email: string } }) {
    const {email} = params;
    try {
        const company = await db.company.findFirst({
            where: {
                users: {
                some: {
                  email: email,
                },

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

