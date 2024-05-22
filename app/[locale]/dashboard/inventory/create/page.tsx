"use client";
import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast"
import { Page, WarehouseType } from "@/app/[locale]/types";
import { getDictionary } from "@/lib/locales";

interface Errors {
  name?: string;
  quantity?: string;
  initial_price?: string;
  general?: string;
}

// @ts-ignore
const InventoryFormPage = ({ params: { locale } }) => {
  const [warehouses, setWarehouses] = useState<WarehouseType[]>([]);
  const [warehouseLoading, setWarehouseLoading] = useState(false);
  const [warehouseCreateLoading, setWarehouseCreateLoading] = useState(false);
  const [warehouseCreateError, setWarehouseCreateError] = useState("");

  const [sucess, setSuccess] = useState(false)
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [initial_price, setInitialPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const router = useRouter();
  const { toast } = useToast()

  const handleWarehouseChange = (value: string) => {
    setSelectedWarehouse(value);
  };

  const handleReset = () => {
    setName("");
    setDescription("");
    setQuantity("");
    setInitialPrice("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
      await axios.post("/api/inventory", formData);
        toast({
          description: "Product has been saved",
          className:"top-0 right-0"
        })
      router.push("/dashboard/inventory");
    } catch (error: any) {
      if (error.response.status === 403) {
        router.push(`/${locale}/dashboard/403`);
      } else {
        console.error("Error submitting form:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWarehouses = async () => {
    setWarehouseLoading(true);
    try {
      const response = await axios.get("/api/warehouse");
      setWarehouses(response.data);
    } catch (error) {
      console.error("Warehouses error:", error);
    } finally {
      setWarehouseLoading(false);
    }
  };

  const [dict, setDict] = useState<any>();

  const loadDictionary = async () => {
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

  const saveWarehouse = async (name: string, location: string) => {
    setWarehouseCreateLoading(true);
    try {
      await axios.post("/api/warehouse/create", { name, location });
      window.location.reload();
    } catch (error: any) {
      setWarehouseCreateError(error.response.data.error);
      setTimeout(() => setWarehouseCreateError(""), 5000);
    } finally {
      setWarehouseCreateLoading(false);
    }
  };

  useEffect(() => {
    loadDictionary();
    fetchWarehouses();
  }, []);

  return (
    <div>
      <Breadcrumb page={pages} heading={dict?.inventoryForm || "Inventory Form"} />
      <div className="bg-white rounded-md w-full p-4 dark:bg-black">
        <div className="mb-4">
          <p className="text-md font-semibold">
            {dict?.invFormHeading || "Fill in the form to register an item."}
          </p>
        </div>
       <div className={`border-2 border-[#1C40CA] rounded-md py-4 px-2 flex justify-center items-center my-4 ${loading ? 'block' : 'hidden'}`}>
              <PiSpinner className="h-6 w-6 mr-2 animate-spin dark:text-white text-[#1C40CA]" />
              {dict?.loading}....

       </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col">
                <p>{dict?.warehouse}</p>
                <Select value={selectedWarehouse} onValueChange={handleWarehouseChange}>
                  <SelectTrigger className="w-full bg-transparent">
                    <SelectValue placeholder={dict?.selectWarehouse || "Select Warehouse"} />
                    <SelectContent className="dark:bg-black dark:text-white">
                      <SelectGroup>
                        {warehouses.map((warehouse) => (
                          <SelectItem key={warehouse.id} value={warehouse.id}>
                            {warehouse.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                      <hr />
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" className="w-full text-center px-8 py-4">
                            <span className="font-semibold text-xl mr-2">+</span>
                            <p>Register Warehouse</p>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-full dark:bg-black">
                          <DialogHeader>
                            <DialogTitle className="tracking-wide dark:text-white">
                              Register Warehouse
                            </DialogTitle>
                          </DialogHeader>
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              saveWarehouse(warehouseName, warehouseLocation);
                            }}
                          >
                            {warehouseCreateError && (
                              <p className="text-red-500 mb-4">{warehouseCreateError}</p>
                            )}
                            <div className="mb-4">
                              <label className="dark:text-white font-semibold mb-2 block">
                                Warehouse Name:
                              </label>
                              <Input
                                type="text"
                                placeholder="Warehouse Name"
                                value={warehouseName}
                                onChange={(e) => setWarehouseName(e.target.value)}
                                required
                                className="bg-transparent"
                              />
                            </div>
                            <div className="mb-4">
                              <label className="dark:text-white font-semibold mb-2 block">
                                Warehouse Location:
                              </label>
                              <Input
                                type="text"
                                placeholder="Warehouse Location"
                                value={warehouseLocation}
                                onChange={(e) => setWarehouseLocation(e.target.value)}
                                required
                                className="bg-transparent"
                              />
                            </div>
                            <DialogFooter>
                              <Button
                                disabled={warehouseCreateLoading}
                                type="submit"
                                className="bg-[#021044] hover:bg-[#021044]/90 flex w-full"
                              >
                                {warehouseCreateLoading ? (
                                  <>
                                    <PiSpinner className="animate-spin mr-2" />
                                    <span>Loading...</span>
                                  </>
                                ) : (
                                  <span>Register</span>
                                )}
                              </Button>
                            </DialogFooter>
                          </form>
                        </DialogContent>
                      </Dialog>
                    </SelectContent>
                  </SelectTrigger>
                </Select>
              </div>
              <div className="flex flex-col gap-1">
                <label>{dict?.name || "Name"}</label>
                <input
                  className={`block bg-transparent w-full dark:text-white rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.name ? "ring-red-500 border-1 border-red-500" : ""}`}
                  placeholder="Item-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setErrors((prev) => ({ ...prev, name: "Field is required" }));
                    } else {
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                />
                {errors.name && <p className="text-red-500 font-semibold">{errors.name}</p>}
              </div>
              <div className="flex flex-col">
                <label>
                  {dict?.description}
                  <span className="text-neutral-400 text-xs">({dict?.optional || "optional"})</span>
                </label>
                <textarea
                  className="border bg-transparent  dark:text-white border-neutral-300 focus:ring-0 active:ring-0 rounded-sm px-2 py-1"
                  rows={4}
                  placeholder="Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="sm:flex grid grid-cols-1 gap-4">
                <div className="flex flex-col w-full">
                  <label>{dict?.initialPrice || "Initial Price"}</label>
                  <input
                    className={`block w-full bg-transparent  dark:text-white rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.initial_price ? "ring-red-500 border-1 border-red-500" : ""}`}
                    placeholder="$ 0.0"
                    type="number"
                    value={initial_price}
                    onChange={(e) => setInitialPrice(e.target.value)}
                    required
                    onBlur={(e) => {
                      if (!e.target.value) {
                        setErrors((prev) => ({ ...prev, initial_price: "Field is required" }));
                      } else {
                        setErrors((prev) => ({ ...prev, initial_price: "" }));
                      }
                    }}
                  />
                  {errors.initial_price && (
                    <p className="text-red-500 font-semibold">{errors.initial_price}</p>
                  )}
                </div>
                <div className="flex flex-col w-full">
                  <label>{dict?.quantity}</label>
                  <input
                    className={`block w-full bg-transparent dark:text-white rounded-md border-0 py-1.5 px-7 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-[#021044] sm:text-sm sm:leading-6 ${errors.quantity ? "ring-red-500 border-1 border-red-500" : ""}`}
                    placeholder="0"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    onBlur={(e) => {
                      if (!e.target.value) {
                        setErrors((prev) => ({ ...prev, quantity: "Field is required" }));
                      } else {
                        setErrors((prev) => ({ ...prev, quantity: "" }));
                      }
                    }}
                  />
                  {errors.quantity && <p className="text-red-500 font-semibold">{errors.quantity}</p>}
                </div>
              </div>
            </div>
            <div className="upload">
              <label>
                {dict?.image || "Image"}
                <span className="text-neutral-400 text-xs">({dict?.optional || "Optional"})</span>
              </label>
              <ImageUpload onChange={setImage} locale={locale} />
            </div>
          </div>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="button"
              className="bg-[#1C40CA]/[0.1] rounded-md font-semibold text-[#1C40CA] px-8 py-2"
              onClick={handleReset}
            >
              {dict?.reset || "Reset"}
            </button>
            <div>
              <button
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
                  dict?.submit || "Submit"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryFormPage;
