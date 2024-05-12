"use client";
import { useEffect, useState } from "react";

import { SessionProvider, useSession } from "next-auth/react"

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

// import getCompany  from '@/app/actions/getCompany'

import axios from "axios";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PiSpinner } from "react-icons/pi";
import Logo from '@/public/aqmada-03.png'

interface Errors {
  company?: string;
  warehouse?: string; 
  industry?: string;
  location?: string;  
  size?: string;
  warehouseLocation?: string;
  general?: string;
}

export default function Onboarding() {
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  const [steps, setSteps] = useState(1);
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({
      name: "",
      size: "",
      location: "",
      industry: ""
    
  })
  const [warehouse, setWarehouse] = useState({
      name: "",
      location: "",
  })
  const { data: session, status } = useSession()

  const user = session?.user?.email
  // check if user has company
  useEffect(() =>{
  if(status === "authenticated" && user){
    const fetchCompany = async () => {
      try {
        const res = await axios.get(`/api/company/${user}`)
        if(res?.data?.id){
          router.push("/dashboard")
        }
      } catch (error) {
        
      }

    }
    fetchCompany()
  }
  }, [])
  
  function handleNext() {
    setSteps(steps + 1);
  }
  function handleBack() {
    setSteps(steps - 1);
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("/api/onboarding", {
        company,
        warehouse,
        user
      });
      if (res.status === 200) {
        router.push("/dashboard");
        setLoading(false);
      } else {
        setErrors({ general: "Something went wrong" });
        setLoading(false);
      }
     
    } catch (error) {
      setErrors({ general: "Something went wrong" });
    }
  };

  // useEffect(() => {
  //   const fetchCompany = async () => {
  //     if(user){
  //       try {
  //         const res = await getCompany(user)
  //         console.log(res)
  //         if(res?.id){
  //           router.push("/dashboard")
  //         }
  //       } catch (error) {
  //         console.log(error)
  //       }

  //     }
  //   }
  //   fetchCompany()
  // }, [router, user])         

  return (
    <main>
      
      <div className="">
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8 mt-4 flex">
          <Link href={"/"} className="flex items-center gap-2" prefetch={true}>
            <Image src={Logo} width={50} height={40} alt="logo" />
            <span className="text-lg font-bold text-[#021044] dark:text-white">
              Aqmada
            </span>
          </Link>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-lg lg:px-8 mt-10 ">
          <form onSubmit={() => {handleSubmit}}>
            <div className="grid grid-row-6 gap-2">
              <div className="mb-4">
                <p className="font-bold">Let&apos;s get started,</p>
                <p className="text-gray-500">
                  Tell us a little about your company.
                </p>
              </div>
              {errors.general && (
                <p className="text-red-500 text-center text-sm">{errors.general}</p>
              )}
              {steps === 1 && (
                <>
                  <div className="grid grid-row gap-2">
                    <label
                      htmlFor="company_name"
                      className="font-semibold text-md"
                    >
                      Company Name
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.company ? "ring-red-500 border-1 border-red-500" :""}`}
                      placeholder="Company Name"
                      value={company.name}
                      onChange={(e) => setCompany({...company, name: e.target.value})}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, company: "Field is required" }))
                        } 
                        else{
                          setErrors((prev) => ({ ...prev, company: "" }))
                        }
                      }}
                    />
                    {errors.company && (
                      <p className="text-red-500 font-semibold">{errors.company}</p>
                    )}
                  </div>
                  <div className="grid grid-row gap-2">
                    <label htmlFor="size" className="font-semibold text-md">
                      Size of your company
                    </label>
                    <Select
                      onValueChange={(value) => setCompany({...company, size: value})}
                      value={company.size}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"Just Me"}>
                            <span>Just Me</span>
                          </SelectItem>
                          <SelectItem value={"2-10"}>
                            <span>2-10</span>
                          </SelectItem>
                          <SelectItem value={"11-50"}>
                            <span>11-50</span>
                          </SelectItem>
                          <SelectItem value={"50+"}>
                            <span>50+</span>
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-row gap-2">
                    <label htmlFor="size" className="font-semibold text-md">
                      Industry
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.industry ? "ring-red-500 border-1 border-red-500" :""}`}
                      placeholder="Industry"
                      value={company.industry}
                      onChange={(e) => setCompany({...company, industry: e.target.value})}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, industry: "Field is required" }))
                        } 
                        else{
                          setErrors((prev) => ({ ...prev, industry: "" }))
                        }
                      }}
                    />
                    {errors.industry && (
                      <p className="text-red-500 text-sm font-semibold">{errors.industry}</p>
                    )}
                  </div>
                  <div className="grid grid-row gap-2">
                    <label htmlFor="size" className="font-semibold text-md">
                    Location
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.location ? "ring-red-500 border-1 border-red-500" :""}`}
                      placeholder="Location"
                      value={company.location}
                      onChange={(e) => setCompany({...company, location:(e.target.value)})}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, location: "Field is required" }))
                        } 
                        else{
                          setErrors((prev) => ({ ...prev, location: "" }))
                        }
                      }}
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm font-semibold">{errors.location}</p>
                    )}
                  </div>
                </>
              )}
              {steps === 2 && (
                <>
                  {/* <p>
                  Register your warehouse
                </p> */}
                  <div className="grid grid-row gap-2">
                    <label
                      htmlFor="warehouse_name"
                      className="font-semibold text-md"
                    >
                      Warehouse Name
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.warehouse ? "ring-red-500 border-1 border-red-500" :""}`}
                      placeholder="Warehouse Name"
                      value={warehouse.name}
                      onChange={(e) => setWarehouse({...warehouse, name: e.target.value})}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, warehouse: "Field is required" }))
                        } 
                        else{
                          setErrors((prev) => ({ ...prev, warehouse: "" }))
                        }
                      }}
                    />
                    {errors.warehouse && (
                      <p className="text-red-500 text-sm font-semibold">{errors.warehouse}</p>
                    )}
                  </div>
                  <div className="grid grid-row gap-2">
                    <label htmlFor="size" className="font-semibold text-md">
                      Warehouse Location
                    </label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.warehouseLocation ? "ring-red-500 border-1 border-red-500" :""}`}
                      placeholder="Warehouse Location"
                      value={warehouse.location}
                      onChange={(e) => setWarehouse({...warehouse, location: e.target.value})}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, warehouseLocation: "Field is required" }))
                        } 
                        else{
                          setErrors((prev) => ({ ...prev, warehouseLocation: "" }))
                        }
                      }}
                    />
                    {errors.warehouseLocation && (
                      <p className="text-red-500 text-sm font-semibold">{errors.warehouseLocation}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            {steps === 1 && (
              <button
                className="bg-[#021044] w-full p-2 text-white font-medium rounded my-4"
                onClick={handleNext}
                disabled={!company.name || !company.industry || !company.location || loading}
              >
                Next
              </button>
            )}
            {steps === 2 && (
              <div className="flex justify-end gap-2">
              <button
                className="text-[#021044] w-full p-2 font-medium rounded my-4 hover:bg-gray-100"
                onClick={handleBack}
              >
                Back
              </button>
              <button
                type="submit"
                className="bg-[#021044] w-full p-2 text-white font-medium rounded my-4 flex justify-center items-center"
                onClick={handleSubmit}
                disabled={!warehouse.name || !warehouse.location || loading}
              >
                                  {
                    loading ?  <PiSpinner className="h-4 w-4 animate-spin text-white" /> : ""
                  }
                   {loading ? "Loading" : "Submit"}
              </button>
              </div>
            )}
          </form>
        </div>
      </div>
      
    </main>
  );
}
