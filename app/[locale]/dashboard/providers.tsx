'use client'
import {ThemeProvider} from 'next-themes';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


export function Provider({children}: {children:React.ReactNode}){
  const router = useRouter()


  useEffect(() =>{
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/auth/me`)
          if(res?.data?.company_id === null){
            router.push("/onboarding")
          }
        } catch (error) {
          
        }
    }

    }, [])
    

    return(
        <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
        {children}
    </ThemeProvider>
    )
}