"use client";

import "../globals.css";
import { Montserrat } from 'next/font/google'
import { SessionProvider } from 'next-auth/react';

const montserrat = Montserrat({
  weight: ['400', '700'],
  subsets: ['latin'],
})


// export const metadata = {
//   title: 'Aqmada | Welcome',
// }


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
           <body         className={
          "bg-background min-h-screen bg-background antialiased " &&
          montserrat.className
        }>{children}</body>
      </SessionProvider>
    </html>
  )
}
