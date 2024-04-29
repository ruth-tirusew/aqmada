import { db } from "@/app/lib/db";

import { getServerSession } from "next-auth/next"
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { ItemType } from "../[locale]/types";
import getCurrentUser from "./getCurrentUser";
import { NextResponse } from "next/server";
export default async function getInventory(): Promise<ItemType[]>{
    try {
        const user = await getCurrentUser();
        if (!user) {
          return [];
        }
        if(!user.company_id){
          return [];
        }
        const items = await db.item.findMany({
          where: {
            warehouse: {
              company_id: user.company_id,
            },
          },
        });
        console.log(items)
        if (items === undefined) {
          return [];
        }
        return items.map((item) => {
          return {
            ...item,
            created_at: item.created_at.toString(),
            updated_at: item.updated_at.toString(),
          };
        });
      }
 catch (e:any) {
      throw new Error(e);
    }
  };
