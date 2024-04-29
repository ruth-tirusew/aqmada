import { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "../globals.css";
import SideBar from "../components/sidebar";
import Topnav from "../components/topnav";

import SessionProvider  from "./sessionprovider";
import {Provider} from "./providers";
import Chatbot from "../components/chattbot";
import Link from "next/link";
import { getDictionary } from "@/lib/locales";


const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Aqmada | Dashboard",
};

export default async function RootLayout({
  children,
  params: {
    locale = "en",
  },
}: {
  children: React.ReactNode;
  params: {
    locale: "en" | "am";
  };
}) {
  const dict = await getDictionary(locale);
  return (
    <html>
      <body className={montserrat.className}>
      <SessionProvider>
      <Provider>
        <div className="flex">
          <div className="sm:w-1/4">
          <SideBar locale= {locale} />
          </div>
          {/* <TopNavBar /> */}
          <div className="bg-slate-100 dark:bg-neutral-900 px-4 sm:px-10 py-4 w-full">
            <div className="">
              <Topnav />
            </div>
             {children} 
            <div className="text-center pt-10">
             <span>
               {dict.copyright}  <Link href="https://perbytes.com" target="_blank" rel="noopener noreferrer" aria-label="Perbytes Systems, Inc." title="Perbytes Systems, Inc." aria-hidden="true" className="text-blue-700 hover:text-blue-800">Perbytes Systems, Inc.</Link> &copy; 2024
                </span>
            </div>
          </div>
        </div>
        {/* <Chatbot /> */}
        </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
