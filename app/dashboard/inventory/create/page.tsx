"use client";
import React, { ChangeEvent, useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { PiSpinner } from "react-icons/pi";
import axios from "axios";

import Breadcrumb from "@/app/components/breadcrumb";
import ImageUpload from "@/app/components/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Page, WarehouseType } from "@/app/types";
import Warehouse from "@/app/components/warehouse";


export default function Dashboard() {
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
      setWarehouseLoading(true)
      const response = await axios.get("/api/warehouse");
      setWarehouses(response.data);
      setWarehouseLoading(false)
    } catch (error) {
      console.error("Warehouses error:", error);
      setWarehouseLoading(false)
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
        <form>
          <div className="flex gap-4">
            <ImageUpload onChange={(value) => setImage(value)} value={image} />
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col">
                <p>Warehouse</p>

                        <Select
                onValueChange={(value) => handleWarehouseChange(value)}
                value={selectedWarehouse}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Warehouse" />
                  <SelectContent className="">
                    <SelectGroup>
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
                <label htmlFor="name">Item Name</label>
                <input
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  placeholder="Item-1"
                  value={name}
                  onChange={e =>{setName(e.target.value)}}
                  required
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="name">
                  Item description
                  <span className="text-neutral-400 text-xs">(optional)</span>
                </label>
                <textarea
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  rows={4}
                  placeholder="Description..."
                  value={description}
                  onChange={e =>{setDescription(e.target.value)}}
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
                    onChange={e =>{setInitialPrice(e.target.value)}}
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label htmlFor="name">Quantity</label>
                  <input
                    className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                    placeholder="12"
                    type="number"
                    value={quantity}
                    onChange={e =>{setQuantity(e.target.value)}}
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
                    onClick={handleSubmit}
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
