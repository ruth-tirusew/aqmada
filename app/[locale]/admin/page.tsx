"use client";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { InvoiceType, Page } from "@/app/[locale]/types";
import { columns } from "./columns";
import getWaitList from "@/app/actions/getWaitList";
import { DataTable } from "@/components/ui/datatable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { PiCheck, PiSpinner } from "react-icons/pi";
import { useRouter } from "next/navigation";

interface Error {
  email?: string;
  general?: string;
}


export default function Admin() {
  const [waitlist, setWaitlist] = useState<any>([]);
  const [registeredUser, setRegisteredUser] = useState("");
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setErrors] = useState<Error>({});
  const [success, setSuccess] = useState(false);


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/waitlist", {
        email: registeredUser,
      })
      if(response.status === 403) {
        router.push("/login");
        return
      }
      else if (response.status === 200  || response.status === 201) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
      setRegisteredUser("");
      }
      
    } catch (error: any) {
      setErrors((prev) => ({ ...prev, general: error.response.data.error}));
      setTimeout(() => {
        setErrors({});
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  const fetchWaitList = async () => {
    try {
      setSaveLoading(true);
      const { data, status } = await axios.get("/api/waitlist");
      setWaitlist(data);
    } catch(error: any){
      if(error.response.status === 403) {
        router.push("/dashboard");
        return
      };
      setErrors((prev) => ({ ...prev, general: "Something went wrong" }));
    } finally {
      setSaveLoading(false);
    }
  };

  useEffect(() => {
    fetchWaitList();
  }, []);

  return (
    <div className="h-screen w-full max-w-7xl">
      <div className="w-1/4">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className="text-md w-full text-center px-8 py-8 md:px-6 md:py-3 dark:text-white text-white dark:bg-gray-900"
            >
              <span className="font-semibold text-xl mr-2">+</span>
              <p>Register User</p>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full dark:bg-gray-900">
            <DialogHeader>
              <DialogTitle className="tracking-wide dark:text-white">
                Register Email
              </DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {error.general && (
                <div className="bg-red-100/[0.2] rounded-md p-2 border-2 border-red-500">
                  <p className="text-red-500 text-center font-medium">
                    {error.general}
                  </p>
                </div>
              )}
              {
                success && (
                  <div className="bg-emerald-100/[0.2] rounded-md p-2 border-2 border-emerald-500">
                    <p className="text-emerald-500 text-center font-medium flex gap-2">
                     <PiCheck/> Registered Successfully
                    </p>
                  </div>
                )
              }
              <div className="grid grid-cols gap-2">
                <label htmlFor="name" className="dark:text-white font-semibold">
                  Email:
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john.doe@aqmada.com"
                  className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${
                    error.email ? "ring-red-500 border-1 border-red-500" : ""
                  }`}
                  required
                  value={registeredUser}
                  onChange={(e) => {
                    setRegisteredUser(e.target.value);
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setErrors((prev) => ({
                        ...prev,
                        email: "Field is required",
                      }));
                    } else {
                      setErrors((prev) => ({ ...prev, email: "" }));
                    }
                  }}
                />
                {error.email && (
                  <p className="text-red-500 text-sm font-semibold">
                    {error.email}
                  </p>
                )}
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#021044] hover:bg-[#021044]/90 flex w-full"
                >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  <p>
                    Loading
                  </p>
                  </div>
                ) : (
                  <p>Save</p>
                )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <DataTable columns={columns}    data={waitlist}
      />
    </div>
  );
}