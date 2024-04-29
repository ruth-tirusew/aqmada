"use client"
import { FormEvent, useState, useCallback, useEffect } from "react";
import axios from "axios";
import { TbPhotoPlus } from 'react-icons/tb'
import Breadcrumb from "../../components/breadcrumb";
import { Page } from "../../types";
import { useParams } from "next/navigation";
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
export default function Settings() {
  const routeParam = useParams<{ locale: "en" | "am" }>();

  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      if(routeParam?.locale){
        const data = await getDictionary(routeParam?.locale);
        setDict(data)
      }
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };
  

  
  const pages: Page[] = [
    {
      name: dict?.Settings,
      href: `/${routeParam?.locale}/dashboard/settings`,
    },
  ]
  
  const [userData, setUserData] = useState({
    profilePicture: "",
    name: "",
    email: "",
    company:{
      name:"",
      size:"",
      industry:"",
      location:""
    }

   })
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    try {
      setLoading(true);
      setError("");
      const response = await axios.post("/api/auth/me", userData);
      if (response.status === 200) {
        window.location.href = `/${routeParam?.locale}/dashboard/settings`;
      } else {
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

  const fetchUserInformation = async()=>{
    try{
      const user = await axios.get("/api/auth/me")
      setUserData(user.data)
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {
    dictionary();
    fetchUserInformation();
  });



  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.Settings || "Settings"}/>
      <div className="bg-white rounded-md w-full p-4 dark:bg-black sm:px-10">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6">
          <p className="text-sm text-red-500 font-semibold mb-4">{error}</p>
            <div className="flex gap-4">
              {/* <div className="h-20 rounded-full px-20">
                <div
                  className="
              relative
              cursor-pointer
              hover:opacity-70
              transition
              border-dashed 
              border-2
              sm:p-20
              p-10
              border-neutral-300
              flex
              flex-col
              justify-center
              items-center
              gap-4
              text-neutral-600
              rounded-full
            "
                  id="upload_widget"
                  {...getRootProps()}
                >
                  <input {...getInputProps()}/>
                  {isDragActive ? (
                    <p>Drop the files here ...</p>
                  ) : (
                    <div className="">
                    <TbPhotoPlus
                        className="
                  w-8
                  h-8
                  text-neutral-600
                "
                      />
                    </div>
                  )}
                  {preview && (
                    <div
                      className="
              absolute inset-0 w-full h-full rounded-full overflow-hidden"
                    >
                      <img
                        style={{ objectFit: "cover" }}
                        src={preview as string}
                        alt="Image"
                      />
                    </div>
                  )}
                </div>
              </div> */}
              <div className="flex flex-col gap-4 w-full mb-4">
                <div className="flex gap-2">
                  <div className="w-full">
                  <label htmlFor="name" className="font-semibold text-sm">
                   {dict?.setttings.fullName}
                  </label>
                  <input
                    className="block w-full rounded-lg border-0 py-3 sm:pl-10 sm:pr-20 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="John"
                    type="text"
                    id="name"
                    name="name"
                    value={userData?.name}
                    disabled={loading}
                    onChange={(e) => {
                      setUserData({ ...userData, name: e.target.value });
                    }}
                    required
                  />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-sm">
                  {dict?.setttings.email}
                  </label>
                  <input
                    className="block w-full rounded-lg border-0 py-3 sm:pl-10 sm:pr-20 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="john.doe@aqmada.com"
                    type="email"
                    id="email"
                    name="email"
                    value={userData?.email}
                    disabled={loading}
                    onChange={(e) => {
                      setUserData({ ...userData, name: e.target.value });
                    }}
                    required
                  />
                </div>
                <div className="flex space-x-2 w-full items-center">
                  <span>{dict?.companyInformation}</span>
                      <hr className="w-[90%] border border-gray-400 my-6"/>
                    </div>

                    <div className="flex flex-col gap-2">
                  <label htmlFor="company_name" className="font-semibold text-sm">
                  {dict?.setttings.company.name}
                  </label>
                  <input
                    className="block w-full rounded-lg border-0 py-3 sm:pl-10 sm:pr-20 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Company Name"
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={userData?.company.name}
                    disabled={loading}
                    onChange={(e) => {
                      setUserData({ ...userData, company: { ...userData.company, name: e.target.value }});
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-sm">
                  {dict?.setttings.company.size}
                  </label>
                    <Select
                      onValueChange={(value: string) => setUserData({ ...userData, company: { ...userData.company, size: value }} )}
                      value={userData?.company.size}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={dict?.select?.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value={"Just Me"}>
                            <span>{dict?.select?.justMe} </span>
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-sm">
                  {dict?.setttings.company.industry}
                  </label>
                  <input
                    className="block w-full rounded-lg border-0 py-3 sm:pl-10 sm:pr-20 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Company Industry"
                    type="text"
                    id="industry"
                    name="industry"
                    value={userData?.company.industry}
                    disabled={loading}
                    onChange={(e) => {
                      setUserData({ ...userData, company: { ...userData.company, industry: e.target.value } });
                    }}
                    required
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="font-semibold text-sm">
                  {dict?.setttings.company.location}
                  </label>
                  <input
                    className="block w-full rounded-lg border-0 py-3 sm:pl-10 sm:pr-20 pl-4 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-0  sm:text-sm sm:leading-6"
                    placeholder="Company Location"
                    type="text"
                    id="location"
                    name="location"
                    value={userData?.company.location}
                    disabled={loading}
                    onChange={(e) => {
                      setUserData({ ...userData, company: { ...userData.company, location: e.target.value } });
                    }}
                    required
                  />
                </div>
              </div>
            </div>
          <div className="w-[95%] flex sm:flex-row flex-col justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semibold text-[#1C40CA] px-8 py-2"
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
                 {dict?.loading}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2 w-full"
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
