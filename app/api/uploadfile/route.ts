import { createClient } from '@supabase/supabase-js'
import { NextResponse } from "next/server";

import { db } from "@/app/lib/db";
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function PUT(request: Request) {
    const user  = await getCurrentUser()
    if(!user){
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try{
        const body = await request.json();
        const files = user?.company?.excel_urls || []
        files.push(body.file)
        await db.company.update({
            where:{
                id: user?.company_id || ""
            },
            data:{
                excel_urls: files
            }
        })
    
    return NextResponse.json({ data:"File Upload Successfull"}, { status: 200 });
        
    }catch(error){
        return NextResponse.json({ error:"Something went wrong"}, { status: 500 });
    }
}