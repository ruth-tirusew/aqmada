import { Metadata } from "next";
import { Montserrat } from "next/font/google";

import "../globals.css";
import SideBar from "../components/sidebar";
import Topnav from "../components/topnav";

import SessionProvider  from "./sessionprovider";
import {Provider} from "./providers";
import Chatbot from "../components/chattbot";
import Link from "next/link";


const montserrat = Montserrat({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "Aqmada | Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body className={montserrat.className}>
      <SessionProvider>
      <Provider>
        <div className="flex">
          <div className="sm:w-1/4 w-1/2">
          <SideBar />
          </div>
          {/* <TopNavBar /> */}
          <div className="bg-slate-100 dark:bg-gray-900 px-10 py-4 w-full">
            <div className="">
              <Topnav />
            </div>
             {children} 
            <div className="text-center pt-10">
             <span>
                All Rights Reserved.  <Link href="https://perbytes.com" target="_blank" rel="noopener noreferrer" aria-label="Perbytes Systems, Inc." title="Perbytes Systems, Inc." aria-hidden="true" className="text-blue-700 hover:text-blue-800">Perbytes Systems, Inc.</Link> &copy; 2024
                </span>
            </div>
          </div>
        </div>
        <Chatbot />
        </Provider>
        </SessionProvider>
      </body>
    </html>
  );
}
