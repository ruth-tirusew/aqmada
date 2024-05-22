import { PermissionEnum } from "@prisma/client";
import { db } from "../db";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function hasPermission(permissions: PermissionEnum, model: string): Promise<boolean> {
    try {
      const user = await getCurrentUser()
    
      if (user && !user.role) {
        return false; 
      }

      const permissionModels = await db.permissionModels.findMany({
        where: {
          model,
          roleId: user?.role?.id
        },
      });

  
      const hasAccess = permissionModels.some((permissionModel) => permissionModel.permission.includes(permissions));
  
      return hasAccess;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  