import { db } from "@/app/lib/db";

export default async function getLogs(){
    try{
        const waitlists = await db.waitlist.findMany()
        const safeWaitlist = waitlists.map((waitlist ) => ({
            ...waitlist,
            created_at: waitlist.created_at.getDate() + "-" + waitlist.created_at.getMonth() + "-" + waitlist.created_at.getFullYear(),
          }))
        return safeWaitlist
    }
    catch (error: any) {
        throw new Error(error);
      }
}