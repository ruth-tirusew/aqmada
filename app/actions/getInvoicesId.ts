import { db } from "@/app/lib/db";

export default async function getInvoices(
    id?: string,
){
    try{
        // const{
        //     image,
        //     name,
        //     quantity,
        //     initial_price
        // } = params;

        let query: any = {};
        if(id){
            const invoice = await db.invoice.findUnique({
                where: {
                    id: id
                }
            })
            return {
                ...invoice,
                // id: invoice.id
            }
        }
        // const items:Invoice[] = await db.invoice.findMany()
        // return items
    }
    catch (error: any) {
        throw new Error(error);
      }
}