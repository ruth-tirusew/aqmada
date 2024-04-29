import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/app/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!user.company_id) {
      return new NextResponse("No company found", { status: 400 });
    }
    return new NextResponse(JSON.stringify(user));
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const userData = await request.json();
    const user = await getCurrentUser();

    if (user?.email == userData.email) {
      await db.user.update({
        where: {
          id: user?.id,
        },
        data: {
          name: userData.name,
          email: userData.email,
        },
      });
      await db.company.update({
        where: {
          id: user?.company_id || "",
        },
        data: {
          name: userData.company.name,
          size: userData.company.size,
          industry: userData.company.industry,
          location: userData.company.location,
        },
      });
    }
    return new NextResponse("Updated", { status: 200 });
  } catch (e: any) {
    return new NextResponse(e.message, { status: 500 });
  }
}