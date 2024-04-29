"use client";
import {useState, useEffect} from 'react';
import { MdOutlineDashboard } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { CiMenuFries } from "react-icons/ci";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LiaCartArrowDownSolid } from "react-icons/lia";



import Link from "next/link";
import Image from "next/image";

import { signOut } from "next-auth/react";
import { NavLink } from "./navlink";
import { getDictionary } from '@/lib/locales';

const SideBar: React.FC<{ locale: "en" | "am" }> = ({
  locale= "en",
}) => {
  const [dict, setDict] = useState<any>();
  const [open, setOpen] = useState(false); 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getDictionary(locale);
        setDict(data);
      } catch (error) {
        console.error("Dictionary error:", error);
      }
    };
  
    fetchData();
  }, [locale]);
  return (
    <div className="">
      <div className='block sm:hidden fixed left-1 z-50 cursor-pointer bg-transparent  dark:text-white rounded-full p-4 rounded-full' onClick={()=>{setOpen(!open)}}>
        <CiMenuFries className='text-xl' />
      </div>
      {open && (
        <>
                    <div className="block sm:hidden  fixed top-0 left-0 h-screen w-screen bg-black bg-opacity-50 z-40" onClick={()=>{setOpen(!open)}}></div>
                  <aside className="block sm:hidden  absolute top-0 left-0 bg-white dark:bg-black dark:text-white flex flex-col bg-white h-screen w-64 z-50 ">
                    <div className="flex justify-end">

                    </div>
                  <Link
                    href="/dashboard"
                    className=" flex flex-col items-center justify-center w-full font-bold text-lg my-4 sm:mb-4 sm:p-2"
                  >
                    <Image
                      src={"/aqmada-03.png"}
                      width={120}
                      height={120}
                      alt="logo"
                      className="sm:w-auto sm:h-auto h-16 w-16"
                    />
                    <p className="hidden md:block dark:text-white font-semibold lg:text-2xl ">{dict?.logo}</p> 
                  </Link>
            
                  <div className="list mt-4 grid grid-cols-1 gap-3">
                    <NavLink heading= {dict?.Dashboard} link= "" icon={MdOutlineDashboard} />
                    <NavLink heading={dict?.Inventory} link="inventory" icon={MdOutlineStorefront} />
                    <NavLink heading={dict?.Invoices} link="invoices" icon={LiaFileInvoiceDollarSolid} />
                    <NavLink heading={dict?.Purchases} link="purchases" icon={LiaCartArrowDownSolid} />
                    <NavLink heading={dict?.Reports} link="reports" icon={HiOutlineDocumentReport} />
                    <NavLink heading={dict?.Users} link="users" icon={MdOutlineAccountCircle} />
                    <NavLink heading={dict?.Settings} link="settings" icon={GoGear} />
                    <div
                      className="flex items-center group pl-8 py-3 gap-2"
                      onClick={() => {
                        signOut();
                      }}
                    >
                      <IoIosLogOut className="group-hover:text-red-500 tex-2xl sm:text-md" />
                      <span className="group-hover:text-black text-gray-500 dark:group-hover:text-white font-semibold hidden sm:block pointer-cursor">
                        {dict?.Logout}
                      </span>
                    </div>
                  </div>
                </aside>
        </>

      )}
          <aside className="hidden sm:block sm:h-screen overflow-y-auto print:hidden  border-r-[1.5px] border-gray-200 dark:bg-black dark:text-white flex flex-col bg-white">
      <Link
        href="/dashboard"
        className=" flex flex-col items-center justify-center w-full font-bold text-lg my-4 sm:mb-4 sm:p-2"
      >
        <Image
          src={"/aqmada-03.png"}
          width={120}
          height={120}
          alt="logo"
          className="sm:w-auto sm:h-auto"
        />
        <p className="hidden md:block dark:text-white font-semibold lg:text-2xl ">{dict?.logo}</p> 
      </Link>

      <div className="list mt-4 grid grid-cols-1 gap-3">
        <NavLink heading= {dict?.Dashboard} link= "" icon={MdOutlineDashboard} />
        <NavLink heading={dict?.Inventory} link="inventory" icon={MdOutlineStorefront} />
        <NavLink heading={dict?.Invoices} link="invoices" icon={LiaFileInvoiceDollarSolid} />
        <NavLink heading={dict?.Purchases} link="purchases" icon={LiaCartArrowDownSolid} />
        <NavLink heading={dict?.Reports} link="reports" icon={HiOutlineDocumentReport} />
        <NavLink heading={dict?.Users} link="users" icon={MdOutlineAccountCircle} />
        <NavLink heading={dict?.Settings} link="settings" icon={GoGear} />
        <div
          className="flex items-center group pl-8 py-3 gap-2"
          onClick={() => {
            signOut();
          }}
        >
          <IoIosLogOut className="group-hover:text-red-500 tex-2xl" />
          <span className="group-hover:text-black text-gray-500 dark:group-hover:text-white font-semibold pointer-cursor">
            {dict?.Logout}
          </span>
        </div>
      </div>
    </aside>

    </div>
  );
};

export default SideBar;
