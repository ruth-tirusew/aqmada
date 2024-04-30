"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PiSpinner } from "react-icons/pi";
import axios from "axios";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import ImageUpload from "@/app/[locale]/components/image";


import { Page, WarehouseType } from "@/app/[locale]/types";

export default function Dashboard() {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setquantity] = useState<number>();
  const [initial_price, setInitialPrice] = useState<number>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const pages: Page[] = [
    {
      name: "Inventory",
      href: "/dashboard/inventory",
    },
    {
      name: "Form",
      href: "/dashboard/inventory/create",
    },
  ];

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleDescChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const handlequantityChange = (event: ChangeEvent<HTMLInputElement>) => {
    setquantity(Number(event.target.value));
  };

  const handleInitialPriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInitialPrice(Number(event.target.value));
  };

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setquantity(0);
    setInitialPrice(0);
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
        quantity,
        initial_price,
      };
      const response = await axios.post("/api/inventory", formData);
      setLoading(true);
      console.log("Save response:", response.data);
      router.push("/dashboard");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Save error:", error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const response = await axios.get("/api/warehouse");
      setWarehouses(response.data);
    } catch (error) {
      console.error("Warehouses error:", error);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  return (
    <div className="">
      <Breadcrumb page={pages} heading="Inventory Form" />
      <div className="bg-white rounded-md w-full p-4">
        <div className="heading mb-4">
          <p className="text-md font-semibold ">
            Fill in the form to register an item.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <ImageUpload onChange={(value) => setImage(value)} value={image} locale="en"/>
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Name</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="Item-1"
                  value={name}
                  onChange={handleNameChange}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">
                Location
                  <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <textarea
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  rows={4}
                  placeholder="Description..."
                  value={description}
                  onChange={handleDescChange}
                />
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col w-full">
                  <label htmlFor="name">Initial Price</label>
                  <input
                    className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                    placeholder="$ 0.0"
                    type="number"
                    value={initial_price}
                    onChange={handleInitialPriceChange}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="name">quantity</label>
                  <input
                    className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                    placeholder="12"
                    type="number"
                    value={quantity}
                    onChange={handlequantityChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="button"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              onClick={handleReset}
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
                  Loading....
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
