'use client'
import {ThemeProvider} from 'next-themes';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';


export function Provider({children}: {children:React.ReactNode}){
    const { data: session, status } = useSession()
    const router = useRouter();
    
    const user = session?.user?.email
    if(status === "authenticated" && user){
      const fetchCompany = async () => {
        try {
          const res = await axios.get(`/api/company/${user}`)
          if(!res?.data?.id){
            router.push("/onboarding")
          }
        } catch (error) {
          
        }
    
      }
      fetchCompany()
    }
    return(
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
    </ThemeProvider>
    )
}