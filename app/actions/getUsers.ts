import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/app/lib/db";
import { UserType } from "../[locale]/types";

export async function getUsers(): Promise<any[]> {
    try{
      const user = await getCurrentUser();
    
      if(!user?.company_id){
        return []
        }
      const employees = await db.user.findMany({
        where: { company_id: user.company_id },
        select: {
            id: true,
            image: true,
            name: true,
            email: true,
            role: true,
            roleId:true,
            company_id: true,
          }
      });
      console.log(employees)
      return employees;
    
      
    }catch(e:any){
      throw new Error(e.message);
    }
  }

  