import { db } from "@/app/lib/db";
import getCurrentUser from "./getCurrentUser";

export default async function getWarehouses(){
    const user = await getCurrentUser();

    const warehouses = await db.warehouse.findMany({
        where: {
            company:{
                users: {
                    some: {
                        id: user?.id
                    }
                }
            }
        }
    });

    const safeWarehouses = warehouses.map((warehouse) => {
        return {
            ...warehouse,
            created_at: warehouse.created_at.toISOString(),
            updated_at: warehouse.updated_at.toISOString()
        }
    })

    return safeWarehouses;
}