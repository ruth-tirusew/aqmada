"use client";
import { useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import { PiSpinner } from "react-icons/pi";
import Logo from '@/public/aqmada-03.png'

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Listing() {
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  const[loading, setLoading]=useState(false)

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors((prev) => ({ ...prev, email: "Email is required" }));
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: "Password is required" }));
    }
    if (email && password){
      try{
        setLoading(true)
        signIn("credentials", {
          email: email,
          password: password,
          callbackUrl: "/onboarding",
          redirect:false
        }).then(((res) => {
            if(res?.status == 200){
              router.push("/")
            }
            setLoading(false)
          })).catch((err:any)=>{
            setErrors((prev) => ({ ...prev, general: err.error }));
          })
      }catch(error){
        setErrors((prev) => ({ ...prev, general: "Invalid email or password" }));

        setLoading(false)
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
          <p className="font-bold text-xl">Welcome back,</p> 
            <p className="text-gray- text-lg">Sign in to continue</p>
          </div>
              <button onClick={() => signIn('google', {callbackUrl:"/dashboard"})} className="border-2 border-[#003949] w-full font-semibold rounded relative p-2">
                <span>
                  <FcGoogle size={24} className="absolute top-2 left-2"/>
                  Continue with Google
                
                </span>
            </button>
            <div className="flex gap-2 items-center justify-center">
              <div className="border h-[0.2px] w-full"></div>
              <p>
                Or
              </p>
              <div className="border h-[0.1px] w-full"></div>
            </div>
            <div className="form">
            <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <p className="text-red-500 text-center">{errors.general}</p>
              <div className="email ">
                <label htmlFor="email" className="font-medium text-md">
                  Email
                </label>
                <input
                  type="text"
                  className={`block rounded-md border-0 py-1.5 pl-7 sm:pr-20 pr:10 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#003949] sm:text-sm sm:leading-6 ${errors.email ? 'ring-red-300' : ' '}`}
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  
                />
                {
                  errors.email && (
                    <span>{errors.email}</span>
                  )
                }
              </div>
              <div className="password">
                <label htmlFor="password" className="font-medium text-md">
                  Password
                </label>
                <input
                  type="password"
                  className={`block rounded-md border-0 py-1.5 pl-7  sm:pr-20 pr:10 w-full text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#003949] sm:text-sm sm:leading-6 ${errors.password ? 'ring-red-300' : ''}`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {
                  errors.password && (
                    <span>{errors.password}</span>
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
              <button type="submit" className="bg-[#021044] w-full p-2 text-white font-medium rounded" disabled={loading || email.length ==0 || password.length == 0}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  <p>
                    Loading
                  </p>
                  </div>
                ) : (
                  <p>Login</p>
                )}
              </button>
            </div>
          </form>
              <div className="text-center my-4">
                <p className="text-gray-500 font-semibold">
                  Don&apos;t have an account?{" "}
                  <Link href={"/signup"} className="text-[#021044] dark:text-white v">
                    Sign up
                  </Link>
                </p>
              </div>

            </div>
        </div>
      </div>
    </main>
  );
}
