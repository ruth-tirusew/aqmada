"use client";

import { MdOutlineDashboard } from "react-icons/md";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineAccountCircle } from "react-icons/md";
import { MdOutlineStorefront } from "react-icons/md";
import { GoGear } from "react-icons/go";
import { IoIosLogOut } from "react-icons/io";
import { HiOutlineDocumentReport } from "react-icons/hi";
import { LiaCartArrowDownSolid } from "react-icons/lia";

import Link from "next/link";
import Image from "next/image";

import { signOut } from "next-auth/react";
import { NavLink } from "./navlink";

const SideBar = () => {
  return (
    <aside className="h-screen overflow-y-auto print:hidden  border-r-[1.5px] border-gray-200 dark:bg-black dark:text-white flex flex-col bg-white">
      <Link
        href="/dashboard"
        className=" flex flex-col items-center justify-center w-full font-bold text-lg my-4 sm:mb-4 sm:p-2"
      >
        <Image
          src={"/aqmada-03.png"}
          width={120}
          height={120}
          alt="logo"
          className="w-auto h-auto"
        />
        <p className="hidden md:block dark:text-white font-semibold lg:text-2xl ">Aqmada</p> 
      </Link>

      <div className="list mt-4 grid grid-cols-1 gap-3">
        <NavLink heading="Overview" link="" icon={MdOutlineDashboard} />
        <NavLink heading="Inventory" link="inventory" icon={MdOutlineStorefront} />
        <NavLink heading="Invoices" link="invoices" icon={LiaFileInvoiceDollarSolid} />
        <NavLink heading="Purchases" link="purchases" icon={LiaCartArrowDownSolid} />
        <NavLink heading="Reports" link="reports" icon={HiOutlineDocumentReport} />
        <NavLink heading="Users" link="users" icon={MdOutlineAccountCircle} />
        <NavLink heading="Settings" link="settings" icon={GoGear} />
        <div
          className="flex items-center group pl-8 py-3 gap-2"
          onClick={() => {
            signOut();
          }}
        >
          <IoIosLogOut className="group-hover:text-red-500 tex-2xl sm:text-md" />
          <span className="group-hover:text-black text-gray-500 dark:group-hover:text-white font-semibold hidden sm:block pointer-cursor">
            Logout
          </span>
        </div>
      </div>
    </aside>
  );
};

export default SideBar;
