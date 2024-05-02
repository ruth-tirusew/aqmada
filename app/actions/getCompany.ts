import { db } from "@/app/lib/db";
import getCurrentUser from "./getCurrentUser";


export default async function getCompany(email: string){
    try{
        const user = await getCurrentUser()
        if(user?.company_id){
            const company = await db.company.findUnique({
                where: {
                    id: user.company_id
                }
            })
            return company
        }    
    }catch(e){
        return null
    }
}

