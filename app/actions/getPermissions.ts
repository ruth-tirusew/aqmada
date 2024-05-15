import { db } from "@/app/lib/db";
import getCurrentUser from "./getCurrentUser";

export default async function getPermissions(){
    try{
       const user = await getCurrentUser()
       const permissions  = await db.role.findMany({
        where:{
            company_id: user?.company_id
        },
        include:{
            permissionModels:true
        }
       })
       return permissions
    }
    catch (error: any) {
        throw new Error(error);
      }
}