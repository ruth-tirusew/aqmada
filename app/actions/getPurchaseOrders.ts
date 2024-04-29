import { db } from "@/app/lib/db";
import { InvoiceType } from "../[locale]/types";

export default async function getPurchaseOrders(){
    try{
        const purchase = await db.purchase.findMany()
        const safePurchase = purchase.map((purchase ) => ({
            ...purchase,
            created_at: purchase.created_at.getDate() + "-" + purchase.created_at.getMonth() + "-" + purchase.created_at.getFullYear(),
            updated_at: purchase.updated_at.toISOString(),
          }))
        return safePurchase
    }
    catch (error: any) {
        throw new Error(error);
      }
}