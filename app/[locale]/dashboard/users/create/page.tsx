"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page, UserType } from "@/app/[locale]/types";
import { useRouter } from "next/navigation";
import { ItemType } from "@/app/[locale]/types";
import { PaymentStatus } from "@prisma/client";

import SelectItems from "@/app/[locale]/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
import ImageUpload from "@/app/[locale]/components/image";
import { getDictionary } from "@/lib/locales";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";



// @ts-ignore
export default function Invoices({params:{locale}}) {
  const pages: Page[] = [
    {
      name: "User",
      href: "/dashboard/users",
    },
    {
      name: "Form",
      href: "/dashboard/users/create",
    },
  ];
  const [userData, setUserData] = useState({
    image:"",
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const [loading , setLoading] = useState(false);
  const [error, setError] = useState("");
  const[roles, setRoles] = useState([])
  const router=useRouter()

  // const handlePaymentStatusChange = (
  //   event: ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setPaymentStatus(event.target.checked);
  // };


  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(locale);
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };
  
  const fetchRoles = async () => {
    const response = await axios.get("/api/permissions");
    console.log(response)
    setRoles(response.data)
  }


  useEffect(() => {
    dictionary();
    fetchRoles()
  }, []);




  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/users", userData);
      if (response.status === 200) {
        window.location.href = "/dashboard/users";
      }
      else {
        setError(response.data.message);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
      setLoading(false);
    } catch (error: any) {
      if(error.response.status === 403){
        router.push(`/${locale || "en"}/dashboard/403`);
      }
      setError(error.response.data.message); 
      setTimeout(() => {
        setError("");
      }, 5000); 
      setLoading(false);  
    }
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.userRegistration || "User Registration"} />
      <div className="bg-white rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold ">
            {dict?.userFormHeading}
          </p>
        </div>
        <form onSubmit={handleSubmit}>


          <p className="text-sm text-red-500 font-semibold mb-4">
            {error}
          </p>
          <div className="flex gap-4">
            <ImageUpload onChange={(value) => setUserData({...userData, image: value})} value={userData?.image} locale={locale}/>
            <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col ">
          <label htmlFor="name" className="font-semibold text-sm">{dict?.fullName}: </label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="John Doe"
                  type="text"
                  id="name"
                  name="name"
                  value={userData?.name}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, name: e.target.value})}}
                  required
                />
              </div>
              <div className="flex flex-col ">
          <label htmlFor="email" className="font-semibold text-sm">{dict?.email}:</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="john.doe@aqmada.com"
                  type="email"
                  id="email"
                  name="email"
                  value={userData?.email}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, email: e.target.value})}}
                  required
                />
              </div>
              <div className="flex flex-col ">
          <label htmlFor="role">{dict?.role}</label>
                              <Select
                      onValueChange={(value) => setUserData({...userData, role: value})}
                      value={userData?.role}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Role" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-900 dark:text-white dark:hover:bg-black">
                      <SelectGroup className="dark:bg-gray-900 dark:text-white dark:hover:bg-black">
                      {roles.map((role:any) => (
                        <SelectItem
                          key={role.id}
                          value={role.id}
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                      </SelectContent>
                    </Select>
              </div>
              <div className="flex flex-col ">
          <label htmlFor="password" className="font-semibold text-sm">{dict?.password}</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="******"
                  type="password"
                  id="password"
                  name="password"
                  value={userData?.password}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, password: e.target.value})}}
                  required
                />
              </div>
              <div className="flex flex-col ">
          <label htmlFor="confirmPassword" className="font-semibold text-sm">{dict?.confirmPassword}</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="******"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData?.confirmPassword}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, confirmPassword: e.target.value})}}
                  required
                />
              </div>
          </div>
          </div>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              disabled={loading}
            >
              {dict?.reset}
            </button>
            <div>
              {loading ? (
                <button
                  className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2 flex items-center"
                  disabled
                >
                  <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  {dict?.loading}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2"
                  >
                    {dict?.submit}
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
