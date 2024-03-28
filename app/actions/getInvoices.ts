import { db } from "@/app/lib/db";

import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]';

import { InvoiceType } from "../types";

export default async function getInvoices(): Promise<InvoiceType[]>{
    try{
      const session = await getServerSession(authOptions);
      if (session?.user?.email) { 
        const user = session.user
        const queryOptions: any = {
          where:{
            company:{
              users:{
                some: {
                  email: user.email,
                },

              }
            }
          },
          include: {
            items: {
              include: {
                item : true
              }
            },
          },
          orderBy: {
            created_at: 'desc'
          }
        }
        const invoices = await db.invoice.findMany(queryOptions)
        const safeInvoice = invoices.map((invoice)=>{
            return({
              ...invoice,
              created_at: invoice.created_at.toISOString(),
              updated_at: invoice.updated_at.toISOString(),
            })
          })
        console.log(invoices)
        return safeInvoice;
    }
    else{
      return []
    }
  }
    catch (error: any) {
        throw new Error(error);
      }
}

