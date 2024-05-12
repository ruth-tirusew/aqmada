"use client";
import { useCallback, useState } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { PiSpinner } from "react-icons/pi";
import Logo from '@/public/aqmada-03.png'

interface Errors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Signup() {
  const [errors, setErrors] = useState<Errors>({});
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      const user = await signIn("google", {
        callbackUrl: "/onboarding",
      });
      setLoading(false);
    } catch (error:any) {
      setLoading(false);
      setErrors({
        general: error.error  ,
      });
    }

  }, []);
  
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      try {
        setLoading(true);
        await axios.post("/api/sign-up", {
          name,
          email,
          password,
        })
        .then((res) => {
          if (res.status === 200) {
            router.push("/login");
          }
          setLoading(false);
        })
        .catch((err:any) => {
          setErrors({general:err.response.error})
          setLoading(false);
        });

      } catch (error) {
      }
    },
    [name, email, password, router],
  );

  // // Remember me
  // const [checked, setChecked] = useState(false);
  // const handleChange = () => {
  //   setChecked(!checked);

  // };

  return (
    <main>
      <div className="">
        <div className="max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8 mt-4 flex">
        <Link href={"/"} className="flex items-center gap-2" prefetch={true}>
        <Image src={Logo} width={50} height={40} alt="logo" />
          <span className="text-lg font-bold text-[#021044] dark:text-white">
            Aqmada
          </span>
              </Link>
        </div>
        <div className="mx-auto max-w-md px-4 sm:max-w-2xl sm:px-6 lg:max-w-xl lg:px-8 mt-10">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-row-6 gap-2">
                <div className="mb-4">
                <p className="font-bold">Let&apos;s get started,</p>
              <p className="text-gray-500">Tell us a little about yourself</p>
                </div>
              {errors.general && (
                <p className="text-red-500 text-center">{errors.general}</p>
              )}

              <div className="email grid grid-row gap-2">
                <label htmlFor="email" className="font-semibold text-md">
                  Name
                </label>
                <input
                  type="text"
                  className="block w-full dark:text-white rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required 
                />
              </div>
              <div className="email grid grid-row gap-2">
                <label htmlFor="email" className="font-semibold text-md">
                  Email
                </label>
                <input
                  type="text"
                  className="block w-full dark:text-white rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6"
                  placeholder="john.doe@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="password grid grid-row gap-2">
                <label htmlFor="password" className="font-semibold text-md">
                  Password
                </label>
                <input
                  type="password"
                  className="block w-full rounded-md border-0 py-1.5 pl-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-x-3">
                {/* <input
                  id="push-email"
                  name="push-notifications"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 text-[#021044] focus:ring-[#021044]"
                ></input>
                <label
                  htmlFor="push-email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Remeber me
                </label> */}
              </div>
              {/* <button
                type="submit"
                className="bg-[#021044] w-full p-2 text-white font-medium rounded my-4"
                disabled={loading}
                aria-disabled={loading}>
                {
                  loading ? <PiSpinnerclassName="h-10 w-10 animate-spin text-[#00A0EA]" /> : ""
                }
                {loading ? "Loading" : "Sign up"}
              </button> */}
              
              <button
                type="submit"
                className="bg-[#021044] w-full p-2 text-white font-medium rounded my-4 flex items-center justify-center"
                disabled={loading}
                aria-disabled={loading}>
                  {
                    loading ?  <PiSpinner className="h-4 w-4 animate-spin text-white" /> : ""
                  }
                   {loading ? "Loading" : "Sign up"}

              </button>
            </div>
          </form>
                        <div className="flex gap-2 w-full items-center my-4">
                <div className="border border-gray-300 w-1/2"></div>
                <p className="text-gray-500">or</p>
                <div className="border border-gray-300 w-1/2"></div>
              
              </div>
              <button
                onClick={() => handleGoogleSignIn()}
                className="border-2 border-[#003949] w-full font-semibold rounded relative p-2 my-4"
              >
                <span>
                  <FcGoogle size={24} className="absolute top-2 left-2" />
                  Continue with Google
                </span>
              </button>
              <div className="text-center">
                <p className="text-gray-500 font-semibold">
                  Already have an account?{" "}
                  <Link href={"/login"} className="text-[#021044]">
                    Sign in
                  </Link>
                </p>
              </div>
        </div>
      </div>
    </main>
  );
}
