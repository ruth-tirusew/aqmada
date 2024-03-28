import getCurrentUser from "@/app/actions/getCurrentUser";
import { db } from "@/app/lib/db";
import { UserType } from "../types";

export async function getUsers(): Promise<UserType[]> {
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
            company_id: true,
            created_at : true,
            updated_at: true,
          },
      });
      const safeEmployees = employees.map((employee) => ({
        ...employee,
        created_at: employee.created_at.toISOString(),
        updated_at: employee.updated_at.toISOString(),
      }));
      return safeEmployees;
    
      
    }catch(e:any){
      throw new Error(e.message);
    }
  }

  