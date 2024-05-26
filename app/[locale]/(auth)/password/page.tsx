"use client";
import { useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import { PiSpinner } from "react-icons/pi";
import Logo from '@/public/aqmada-03.png'
import { error } from "console";
import { confirm } from "dropzone";
import axios from "axios";

interface Errors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function Listing() {
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  const[loading, setLoading]=useState(false)

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    if (confirmPassword !== password) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }));
    }
    if (password && confirmPassword === password){
      try{
        setLoading(true)
        const result = await axios.put('/api/auth/me/password', {password})
          router.push("/onboarding");
          setLoading(false)
        if(result?.status !== 200 ){
          setErrors((prev) => ({ ...prev, general: "Invalid password" }));
          setLoading(false)
          setTimeout(() => {
            setErrors({});
          }, 5000);
        }
      }catch(error:any){
        if(error?.status !== 401){
          router.push("/login")
        }
        setErrors((prev) => ({ ...prev, general: "Something went wrong"}));
        setLoading(false)
        setTimeout(() => {
          setErrors({});
        }, 5000);

      }
    }
  };

  // // Remember me
  // const [checked, setChecked] = useState(false);
  // const handleChange = () => {
  //   setChecked(!checked);

  // };

  return (
    <main className="m-4 mx-10">
      <Link href={"/"}>
                <div className="logo flex items-center">
                <Image src={Logo} width={50} height={40} alt="logo" />
                  <p className="font-bold text-[#003949] text-xl dark:text-white">AQMADA</p>
                </div>
          </Link>
          <div className="grid place-content-center w-screen">
        <div className="flex flex-col gap-4 py-20">
          <div className="">
          <p className="font-bold text-xl">Welcome,</p> 
            <p className="text-gray- text-lg">Please change your password to continue</p>
          </div>
            <div className="flex gap-2 items-center justify-center">
              <div className="border h-[0.2px] w-full"></div>
            </div>
            <div className="form">
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              {
                errors.general && (
                  <div className="bg-red-100/[0.2] rounded-md p-2 border-2 border-red-500">
                      <p className="text-red-500 text-center font-medium">{errors.general}</p>
                  </div>
                )
              }
              <div className="password ">
                <label htmlFor="password" className="font-medium text-md">
                  Password
                </label>
                <input
                      type="password"
                      className={`block rounded-md border-0 dark:text-white py-1.5 pl-7 sm:pr-20 pr:10 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#003949] sm:text-sm sm:leading-6 ${errors.password ? 'ring-red-300' : ''}`}
                      placeholder="********"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      onBlur={(e) => {
                        if (!e.target.value) {
                          setErrors((prev) => ({ ...prev, email: "Email is required" }))
                        } 
                        else if(password.length < 6){
                          setErrors((prev) => ({ ...prev, password: "Password must be at least 8 characters" }))
                        }
                        else{
                          setErrors((prev) => ({ ...prev, password: "" }))
                        }
                      }}
                    />
                {
                  errors.password && (
                    <span className="text-red-500 font-semibold text-sm">{errors.password}</span>
                  )
                }
              </div>
              <div className="password">
                <label htmlFor="password" className="font-medium text-md">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className={`block rounded-md dark:text-white border-0 py-1.5 pl-7  sm:pr-20 pr:10 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#003949] sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'ring-red-300' : ''}`}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setErrors((prev) => ({ ...prev, confirmPassword: "Password is required" }))
                    }
                    else if(password !== e.target.value){
                      setErrors((prev) => ({ ...prev, confirmPassword: "Passwords do not match" }))
                    }
                    else{
                      setErrors((prev) => ({ ...prev, confirmPassword: "" }))
                    }
                  }}
                  required
                />
                {
                  errors.confirmPassword && (
                    <span className="text-red-500 font-semibold text-sm">{errors.confirmPassword}</span>
                  )
                }
              </div>
              <div className="flex items-center gap-x-3">
                {/* <input
                  id="push-email"
                  name="push-notifications"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 text-[#003949] focus:ring-[#003949]"
                ></input>
                <label
                  htmlFor="push-email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Remeber me
                </label> */}
              </div>
              <button type="submit" className="bg-[#021044] w-full p-2 text-white font-medium rounded" disabled={loading || password.length < 8 || password !== confirmPassword}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  <p>
                    Loading
                  </p>
                  </div>
                ) : (
                  <p>Confirm</p>
                )}
              </button>
            </div>
          </form>
            </div>
        </div>
      </div>
    </main>
  );
}
