"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PiSpinner } from "react-icons/pi";
import axios from "axios";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ImageUpload from "@/app/[locale]/components/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Page, WarehouseType } from "@/app/[locale]/types";
import Warehouse from "@/app/[locale]/components/warehouse";
import {getDictionary} from "@/lib/locales";

interface Errors{
  name?: string,
  quantity?: string,
  initial_price?: string,
  general?:string
}



// @ts-ignore
export default function InventoryFormPage({params: {locale}}) {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseError, setWarehouseError] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [initial_price, setInitialPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setQuantity("")
    setInitialPrice("");
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = {
        warehouse_id: selectedWarehouse,
        image,
        name,
        description,
        quantity: parseInt(quantity),
        initial_price: parseFloat(initial_price),
      };
      const response = await axios.post("/api/inventory", formData);
      setLoading(true);
      router.push("/dashboard/inventory");
      setLoading(false);
    } catch (error: any) {
      if(error.response.status == 403){
        router.push(`/${locale}/dashboard/403`)
      }
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    try {
      setWarehouseLoading(true)
      const response = await axios.get("/api/warehouse");
      setWarehouses(response.data);
      setWarehouseLoading(false)
    } catch (error) {
      console.error("Warehouses error:", error);
      setWarehouseLoading(false)
    }
  };
  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(locale);
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };
  

  
  const pages: Page[] = [
    {
      name: dict?.Inventory || "Inventory",
      href: `/${locale}/dashboard/inventory`,
    },
    {
      name: dict?.inventoryForm || "Inventory Form",
      href: `/${locale}/dashboard/inventory/create`,
    },
  ];




  useEffect(() => {
    dictionary();
    fetchWarehouses();
  }, []);

  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.inventoryForm || "Inventory Form"}/>
      <div className="bg-white rounded-md w-full p-4 dark:bg-gray-900">
        <div className="mb-4">
          <p className="text-md font-semibold ">
            {dict?.invFormHeading || "Fill in the form to register an item."}
          </p>
        </div>
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col">
                <p>{dict?.warehouse}</p>
                        <Select
                onValueChange={(value) => handleWarehouseChange(value)}
                value={selectedWarehouse}
              >
                <SelectTrigger className="w-full dark:bg-gray-900">
                  <SelectValue placeholder={dict?.selectWarehouse || "Select Warehouse"}/>
                  <SelectContent className="dark:bg-gray-900 dark:text-white dark:hover:bg-black">
                    <SelectGroup className="dark:bg-gray-900 dark:text-white dark:hover:bg-black">
                      {warehouses.map((warehouse) => (
                        <SelectItem
                          key={warehouse.id}
                          value={warehouse.id}
                        >
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <hr />
                    <Warehouse />
                  </SelectContent>
                </SelectTrigger>

              </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="name">{dict?.name || "Name"}</label>
                <input
                  className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.name ? "ring-red-500 border-1 border-red-500" :""}`}
                  placeholder="Item-1"
                  value={name}
                  onChange={e =>{setName(e.target.value)}}
                  required
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setErrors((prev) => ({ ...prev, name: "Field is required" }))
                    } 
                    else{
                      setErrors((prev) => ({ ...prev, name: "" }))
                    }
                  }}
                  />
                  {errors.name && (
                    <p className="text-red-500 font-semibold">{errors.name}</p>
                  )}
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">
                  {dict?.description}
                  <span className="text-neutral-400 text-xs">({dict?.optional || "optional"})</span>
                </label>
                <textarea
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  rows={4}
                  placeholder="Description..."
                  value={description}
                  onChange={e =>{setDescription(e.target.value)}}
                />
              </div>
              <div className="sm:flex grid grid-cols-1 gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="name">{dict?.initialPrice || "Initial Price"}</label>
                  <input
                    className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.initial_price ? "ring-red-500 border-1 border-red-500" :""}`}
                    placeholder="$ 0.0"
                    type="number"
                    value={initial_price}
                    onChange={e =>{setInitialPrice(e.target.value)}}
                    required
                    onBlur={(e) => {
                      if (!e.target.value) {
                        setErrors((prev) => ({ ...prev, initial_price: "Field is required" }))
                      } 
                      else{
                        setErrors((prev) => ({ ...prev, initial_price: "" }))
                      }
                    }}
                  />
                  {errors.initial_price && (
                    <p className="text-red-500 font-semibold">{errors.initial_price}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="name">{dict?.quantity}</label>
                  <input
                    className={`block w-full rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.quantity ? "ring-red-500 border-1 border-red-500" :""}`}
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={e =>{setQuantity(e.target.value)}}
                    required
                    onBlur={(e) => {
                      if (!e.target.value) {
                        setErrors((prev) => ({ ...prev, quantity: "Field is required" }))
                      } 
                      else{
                        setErrors((prev) => ({ ...prev, quantity: "" }))
                      }
                    }}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 font-semibold">{errors.quantity}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="upload">
            <label htmlFor="name">
                  {dict?.image || "Image"}
                  <span className="text-neutral-400 text-xs">({dict?.optional || "Optional"})</span>
                </label>
            <ImageUpload onChange={(value) => setImage(value)} locale={locale}/>
            </div>
          </div>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="button"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              onClick={handleReset}
            >
              {dict?.reset || "Reset"}
            </button>
            <div>
            <button
                onClick={handleSubmit}
                type="submit"
                className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2 flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                    {dict?.loading}....
                  </>
                ) : (
                  dict?.submit
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
