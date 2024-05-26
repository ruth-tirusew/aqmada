"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import {
  Page,
  InvoiceItemsType,
  InvoiceItemForm,
  PermissionModelsForm,
} from "@/app/[locale]/types";
import { useParams, useRouter } from "next/navigation";
import { ItemType } from "@/app/[locale]/types";
import { PaymentStatus, PermissionEnum } from "@prisma/client";

import SelectItems from "@/app/[locale]/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AiOutlineClose } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { FancyMultiSelect } from "@/app/[locale]/components/multipleSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { getDictionary } from "@/lib/locales";

interface FormData {
  role: string;
  permissions: [];
}

export default function Permissions() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [permissions, setPermissions] = useState<any[]>([
    { model: "", permission: [] },  
  ]);
  const router = useRouter();
  const routeParams = useParams<{ id: string; locale: "en" | "am" }>();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setRole(event.target.value);
  };


  const handlePermissionChange = (
    index: number,
    field: keyof PermissionModelsForm,
    value: any
  ): void => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[index][field] = value;
      return updatedPermissions;
    });
  };
  
  const handleReset = (): void => {
    setRole("")
    setPermissions( [{ model: "", permission: [null] }])
  }

  const handleAddPermission = (): void => {
    setPermissions([...permissions, { model: "", permission: [] }]);
  };

  const handleRemovePermission = (index: number): void => {
    const updatedPermissions = permissions.filter((_, i) => i !== index);
    setPermissions(updatedPermissions);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();

    try {
      const formData = {
        role,
        permissions,
      };
      setLoading(true);
      await axios.post("/api/permissions", formData);
      router.push("/dashboard/permissions");
      setLoading(false);
    } catch (error: any) {
      if (error.status === 400) {
        setError(error.data.message);
        setLoading(false);
        setTimeout(() => {
          setError("");
        }, 5000);
        return;
      }
      setError("Something went wrong");
      setLoading(false);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  const handleCheckboxChange = (
    index: number,
    permissionIndex: number,
    value: PermissionEnum | null
  ): void => {
    const updatedPermissions = [...permissions];
    if(value!==null){
      updatedPermissions[index].permission[permissionIndex] = value
      setPermissions(updatedPermissions);
      
    }
  };
  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(routeParams?.locale || "en");
      setDict(data);
    } catch (error:any) {
      if(error.response.status === 403){
        router.push(`/${routeParams?.locale || "en"}/dashboard/403`);
      }
    }
  };

  useEffect(() => {
    dictionary();
  }, []);

  const pages: Page[] = [
    {
      name: dict?.permissions || "Permissions",
      href: `/${routeParams?.locale}/dashboard/invoices`,
    },
    {
      name: "Form",
      href: `/${routeParams?.locale}/dashboard/invoices/create`,
    },
  ];

  return (
    <div className="h-screen">
      <Breadcrumb
        page={pages}
        heading={dict?.permissionsForm || "Permissions Form"}
      />
      <div className="bg-white dark:bg-black rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold ">
            {dict?.permissionFormSubheading ||
              "Fill in the form to register a permission."}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <p className="text-sm text-red-500 font-semibold mb-4">{error}</p>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="name" className="font-semibold">{dict?.roleName || "Role Name"} :</label>
                <input
                  type="text"
                  placeholder="Admin"
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-4 py-1 bg-transparent"
                  value={role}
                  onChange={handleNameChange}
                />
              </div>
              {permissions.map((item, index) => (
                <div key={index} className="w-full flex w-full align-center  border border-neutral-300 rounded-sm p-2">
                <div className=" border-r-[1px] grid grid-cols-1 sm:grid-cols-2 gap-6 border-gray-200 p-2 w-full">
                      <div className="flex flex-col gap-1">
                            <label className="font-semibold">{dict?.record || "Record"}:</label>
                          <select
                                  id="model"
                                  name="model"
                                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-20 py-2 bg-transparent"
                                  onChange={(event) => {
                                    handlePermissionChange(index, "model", event.target.value);
                                  }}
                                  value={item.model}
                                >
                              <option value={"Warehouse"}>
                                {dict?.warehouse || "Warehouse"}
                              </option>
                              <option value="Purchase">
                                {dict?.Purchases || "Purchase"}
                              </option>
                              <option value="Invoice">
                                {dict?.invoice || "Invoice"}
                              </option>
                              <option className="User">
                                {dict?.Users || "User"}
                              </option>
                            </select>
                        </div>
                          <div className="flex flex-col gap-1">
                        <label className="font-semibold"> {dict?.permissions || "Permission"}:</label>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="grid sm:grid-cols-2 grid-cols-1 gap-4">
                              <div className="flex items-center space-x-2">
                              <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600 dark:text-indigo-600 dark:focus:ring-indigo-600"
                              value={item.permission[0]}
                                  onChange={(isChecked) =>
                                    handleCheckboxChange(index, 0, isChecked ? PermissionEnum.CREATE : null)
                                }
                                />
                                <label
                                  htmlFor={`create-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {dict?.create || "Create"}
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                              <input
                                 type="checkbox"
                                 className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600 dark:text-indigo-600 dark:focus:ring-indigo-600"
                                 value={item.permission[1]}
                                 onChange={(isChecked:any) => 
                                  handleCheckboxChange(index, 1, isChecked ? PermissionEnum.UPDATE : null)
                                }
                                />
                                <label
                                  htmlFor={`update-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {dict?.update || "Update"}
                                </label>
                              </div>
                              <div className="flex items-center space-x-2">
                              <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-gray-600 focus:ring-gray-600 dark:text-indigo-600 dark:focus:ring-indigo-600"
                                  value={item.permission[2]}
                                  onChange={(isChecked) =>
                                    handleCheckboxChange(index,2, isChecked ? PermissionEnum.DELETE : null)
                                }
                                />
                                <label
                                  htmlFor={`delete-${index}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {dict?.delete || "Delete"}
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                  </div>
                  <button
                    type="button"
                    className="pt-4"
                    onClick={() => handleRemovePermission(index)}
                  >
                    <AiOutlineClose className="text-red-500 text-sm cursor-pointer mx-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="button"
            className="border border-[#1C40CA] border rounded-md  text-[#1C40CA] px-8 py-2 my-4"
            onClick={handleAddPermission}
          >
            + {dict?.addPermission || "Add Permission"}
          </button>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              disabled={loading}
              onClick={handleReset}
            >
              {dict?.reset || "Reset"}
            </button>
            <div>
              {loading ? (
                <button
                  className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2 flex items-center"
                  disabled
                >
                  <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  {dict?.loading || "Loading"}
                </button>
              ) : (
                <>
                  <button
                    type="submit"
                    className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2"
                  >
                    {dict?.submit || "Submit"}
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
