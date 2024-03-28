import { db } from "@/app/lib/db";

export default async function getLogs(){
    try{
        const logs = await db.logs.findMany()
        const safeLog = logs.map((log ) => ({
            ...log,
            created_at: log.created_at.getDate() + "-" + log.created_at.getMonth() + "-" + log.created_at.getFullYear(),
          }))
        return safeLog
    }
    catch (error: any) {
        throw new Error(error);
      }
}