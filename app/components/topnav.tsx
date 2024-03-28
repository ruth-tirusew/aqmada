"use client";
import React from "react";

import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CiBellOn } from "react-icons/ci";
import { IoLanguageOutline } from "react-icons/io5";

import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { IoIosLogOut } from "react-icons/io";
import { CiUser } from "react-icons/ci";
import { GoGear } from "react-icons/go";

const Topnav = () => {
  const { setTheme } = useTheme();
  const { data: session, status } = useSession();

  const user = session?.user;
  const user_initials = user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("");



  if (status === "loading") {
    return null;
  }
  return (
    <div className="flex justify-end items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div
            className="hover:bg-transparent dark:hover:text-white p-2 pointer-cursor"
          >
            <SunIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            Dark
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            System
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            className="hover:bg-transparent dark:hover:text-white p-2 pointer-cursor"
          >
            <IoLanguageOutline className="text-2xl" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>
            Amharic
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>
            English
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <div
            className="hover:bg-transparent dark:hover:text-white p-2 pointer-cursor mr-2"
          >
            <CiBellOn className="text-2xl" />
            <span className="sr-only">Notifications</span>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Lorem Ipsum</DropdownMenuItem>
          <DropdownMenuItem>Lorem Ipsum</DropdownMenuItem>
          <DropdownMenuItem>Lorem Ipsum</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}>
            <Button>View all notifications</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar>
            <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
            <AvatarFallback className="text-white bg-[#021044] rounded-full pointer-cursor">
            <CiUser className=" text-2xl"/>
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src={user?.image ?? ""} alt={user?.name ?? ""} />
              <AvatarFallback>
                <CiUser className=""/>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p>{user?.name}</p>
              <p className="text-xs text-gray-500 font-light dark:text-gray-400">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <GoGear className="mr-2"/>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => signOut()}>
              <IoIosLogOut className= "mr-2 text-red-500" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Topnav;
