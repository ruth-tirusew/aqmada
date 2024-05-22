"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { ItemType, Page } from "@/app/[locale]/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/locales";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AiOutlineClose } from "react-icons/ai";
import { PiSpinner } from "react-icons/pi";

interface FormData {
  file: string;
  vendor: string;
  items: ItemType[];
  order_number?: string;
}

interface Item {
  id: string;
  name: string;
  image: string;
  quantity: number;
  initial_price: number;
}


// @ts-ignore
export default function PurchaseOrderForm({ params: { locale } }) {
  const [order_number, setPurchaseOrder] = useState("");
  const [file, setFile] = useState("");
  const [vendor, setVendorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [items, setItems] = useState<Item[]>([
    { id: "", name: "", image: "", quantity: 0, initial_price: 0 },
  ]);
  const [dict, setDict] = useState<any>();


  const router = useRouter();

  
  const dictionary = async () => {
    try {
      const data = await getDictionary(locale || "en");
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  }
  

  const pages: Page[] = [
    {
      name: "Purchase",
      href: "/dashboard/purchase",
    },
    {
      name: "Form",
      href: "/dashboard/purchase/create",
    },
  ];

  const [inventoryItems, setInventoryItems] = useState<ItemType[]>([]);

  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/inventory");
      setInventoryItems(response.data);
      setLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setVendorName(event.target.value);
  };
  const handleOrderNumberChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPurchaseOrder(event.target.value);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.value);
  };

  const handleReset = () => {
    setVendorName("");
  };

  const handleItemChange = (
    index: number,
    field: keyof Item,
    value: any
  ): void => {
    const updatedItems = [...items];

    switch (field) {
      case "id":
        updatedItems[index][field] = value as string;
        break;
      case "name":
        updatedItems[index][field] = value as string;
        break;
      case "image":
        updatedItems[index][field] = value as string;
        break;
      case "quantity":
        updatedItems[index][field] = value;
        break;
      case "initial_price":
        updatedItems[index][field] = value;
        break;
      default:
        break;
    }
    setItems(updatedItems);
  };

  const handleAddInventoryItem = (): void => {
    setItems([
      ...items,
      {
        id: "",
        name: "",
        image: "",
        quantity: 0,
        initial_price: 0,
      },
    ]);
  };

  const handleRemoveInventoryItem = (index: number): void => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData: FormData = {
        file,
        //@ts-ignore
        items,
        vendor,
        order_number,
      };
      if (items.length === 1) {
        for (const item of items) {
          if (item.id === "") {
            return;
          }
        }
      }
      await axios.post("/api/purchase", formData);
      router.push("/dashboard/purchases");
    } catch (error:any) {
      setError("Something went wrong");
      setTimeout(() => {
        setError("");
      }, 5000);
      setLoading(false)
      if(error.response.status === 403){
        router.push(`/${locale || "en"}/dashboard/403`);
      }
    }
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.purchaseFormHeading ||"Purchase Form"} />
      <div className="bg-white rounded-md w-full p-4 dark:bg-black">
        <div className=" mb-4">
          <p className="text-md font-semibold ">
          {dict?.purchaseFormSubheading ||" Fill in the form to register an purchase."}
          </p>
        </div>
        <div className={`border-2 border-[#1C40CA] rounded-md py-4 px-2 flex justify-center items-center my-4 ${loading ? 'block' : 'hidden'}`}>
              <PiSpinner className="h-6 w-6 mr-2 animate-spin dark:text-white text-[#1C40CA]" />
              {dict?.loading || "Loading"}....

       </div>
        <form onSubmit={handleSubmit}>
        {error && (
                <div className="bg-red-100/[0.2] rounded-md p-2 border-2 border-red-500">
                  <p className="text-red-500 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}
          <div className="flex flex-col gap-4">
            <div className="vendor-name">
              <label className="text-sm font-semibold" htmlFor="vendor-name">
              {dict?.vendorName ||"Vendor Name"}
              </label>
              <Input
                type="text"
                placeholder="Vendor Name"
                value={vendor}
                onChange={handleNameChange}
                id="vendor-name"
                className="bg-transparent"
              />
            </div>
            <div className="flex gap-4 w-full">
              <div className="p-o w-full">
                <label
                  className="text-sm font-semibold"
                  htmlFor="purchase-order"
                >
                  {dict?.orderNumber ||"Order Number"}
                </label>
                <Input
                  type="text"
                  placeholder="PO Number"
                  value={order_number}
                  onChange={handleOrderNumberChange}
                  id="purchase-order"
                  className="bg-transparent"
                />
              </div>
              <div className="files w-full">
                <label
                  className="text-sm font-semibold items-center"
                  htmlFor="files"
                >
                  {dict?.attachFiles ||"Attach Files"}
                </label>
                <Input
                  type="file"
                  placeholder="PO Number"
                  value={file}
                  onChange={handleFileChange}
                  id="files"
                  className="bg-transparent"
                />
              </div>
            </div>
            {items.map((item, index) => (
              <div className="" key={index}>
                <div className="flex space-x-2 w-full">
                  <div className="w-full border-[0.5px] border-gray-400 my-4"></div>
                </div>
                <div className="grid grid-cols-1 gap-4 items-center w-full">
                  <div className="w-full flex w-full align-center  border border-neutral-300 rounded-sm p-2">
                    <div className=" border-r-[1px] gap-2 grid grid-cols-1 border-gray-200 p-4 w-full">
                    <div className="flex flex-col gap-1 w-full">
                      <label
                        className="text-sm font-semibold"
                        htmlFor="purchase-order"
                      >
                        {dict?.item ||"Item"}<span className="text-red-600">*</span>
                      </label>
                      <Select
                        onValueChange={(value) =>
                          handleItemChange(index, "id", value)
                        }
                        required
                      >
                        <SelectTrigger className="w-full bg-transparent">
                          <SelectValue placeholder="Select item" />
                        </SelectTrigger>
                        {loading ? (
                          <SelectContent>Loading...</SelectContent>
                        ) : inventoryItems.length === 0 ? (
                          <SelectContent>No items found</SelectContent>
                        ) : (
                          <SelectContent className="dark:bg-gray-900 dark:text-white">
                            {inventoryItems.map((group) => (
                              <SelectGroup key={group.id}>
                                <SelectItem value={group.id}>
                                  {group.name}
                                </SelectItem>
                              </SelectGroup>
                            ))}
                            <hr />
                            <button
                              className="flex justify-center space-x-4 py-2 items-center w-full"
                              onClick={() => {
                                router.push("/dashboard/inventory/create");
                              }}
                            >
                              <span className="font-semibold text-[#1C40CA] text-xl">
                                +
                              </span>
                              <p>Register Item</p>
                            </button>
                          </SelectContent>
                        )}
                      </Select>
                    </div>
                    <div className="w-full">
                      <label
                        className="text-sm font-semibold items-center"
                        htmlFor="quantity"
                      >
                        {dict?.quantity ||"Quantity"}<span className="ml-2 text-red-600">*</span>
                      </label>
                      <Input
                        placeholder="0"
                        value={item.quantity}
                        onChange={(event) =>
                          handleItemChange(
                            index,
                            "quantity",
                            event.target.value
                          )
                        }
                        // onChange={handlequantityChange}
                        id="quantity"
                        className="bg-transparent"
                        required
                      />
                    </div>
                    <div className="w-full">
                      <label
                        className="text-sm font-semibold items-center"
                        htmlFor="initial_price"
                      >
                        {dict?.sellingPrice ||"Price"}<span className="ml-2 text-red-600">*</span>
                      </label>
                      <Input
                        type="number"
                        placeholder="$ 0.0"
                        value={item.initial_price}
                        onChange={(event) =>
                          handleItemChange(
                            index,
                            "initial_price",
                            event.target.value
                          )
                        }
                        id="initial_price"
                        className="bg-transparent"
                        required
                        
                      />
                    </div>
                    </div>
                    <button
                    type="button"
                    className="pt-4"
                    onClick={() => handleRemoveInventoryItem(index)}
                  >
                     <AiOutlineClose className="text-red-500 text-sm cursor-pointer mx-4"/>
                  </button>
                  </div>
                </div>
              </div>
            ))}
            <button
               className="border border-[#1C40CA] border rounded-md  text-[#1C40CA] px-8 py-2 my-4"
              onClick={handleAddInventoryItem}
            >
             + {dict?.addItems ||"Add Items"}
            </button>
          </div>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="button"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              onClick={handleReset}
            >
              {dict?.reset ||"Reset"}
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
