"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/components/breadcrumb";
import { Page, UserType } from "@/app/types";
import { useRouter } from "next/navigation";
import { ItemType } from "@/app/types";
import { PaymentStatus } from "@prisma/client";

import SelectItems from "@/app/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
import ImageUpload from "@/app/components/image";

export default function Invoices() {
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

  // const handlePaymentStatusChange = (
  //   event: ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setPaymentStatus(event.target.checked);
  // };




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
      console.log(error);
      setError(error.response.data.message); 
      setTimeout(() => {
        setError("");
      }, 5000); 
      setLoading(false);  
    }
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading="User Registration" />
      <div className="bg-white rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold ">
            Fill in the form to register a new user.
          </p>
        </div>
        <form onSubmit={handleSubmit}>


          <p className="text-sm text-red-500 font-semibold mb-4">
            {error}
          </p>
          <div className="flex gap-4">
            <ImageUpload onChange={(value) => setUserData({...userData, image: value})} value={userData?.image} />
            <div className="flex flex-col gap-2 w-full">
            <div className="flex flex-col ">
          <label htmlFor="name" className="font-semibold text-sm">Full Name: </label>
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
          <label htmlFor="email" className="font-semibold text-sm">Email</label>
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
          <label htmlFor="role">Role</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="Admin"
                  type="text"
                  id="role"
                  name="name"
                  value={userData?.role}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, role: e.target.value})}}
                  required
                />
              </div>
              <div className="flex flex-col ">
          <label htmlFor="password" className="font-semibold text-sm">Password</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="******"
                  type="password"
                  id="password"
                  name="password"
                  value={userData?.name}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, password: e.target.value})}}
                  required
                />
              </div>
              <div className="flex flex-col ">
          <label htmlFor="confirmPassword" className="font-semibold text-sm">Confirm Password</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="******"
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userData?.confirmPassword}
                  disabled={loading}
                  onChange={e =>{setUserData({...userData, password: e.target.value})}}
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
              Reset
            </button>
            <div>
              {loading ? (
                <button
                  className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2 flex items-center"
                  disabled
                >
                  <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  Loading
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2"
                  >
                    Save
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
