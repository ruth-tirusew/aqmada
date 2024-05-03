'use client'
import React, { ChangeEvent, use, useEffect, useState } from "react";
import axios from "axios";
import { PurchaseItem } from "@prisma/client";

import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { ItemType, Page } from "@/app/[locale]/types";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import SelectItems from "@/app/[locale]/components/SelectItem";
import { getDictionary } from "@/lib/locales";

interface FormData {
  file: string;
  vendor: string;
  items: ItemType[];
  order_number?: string;
}

interface Item {
  id: string;
  name: string;
  quantity: number;
  initial_price: number;
}

// @ts-ignore
export default function PurchaseOrderForm() {
  const routeParam = useParams<{ id: string, locale: "en" | "am" }>();
  const [order_number, setPurchaseOrder] = useState("");
  const [file, setFile] = useState("");
  const [vendor, setVendorName] = useState("");
  const [loading, setLoading] = useState(false);
  const[items, setItems] = useState<any[]>([
    { inventory_id:"", quantity:0, price:0 },
  ])
  const router = useRouter()

  const fetchPurchaseOrder = async () => {
    try{
        setLoading(true)
        const {data} = await axios.get(`/api/purchase/${
            routeParam?.id
        }`)
        console.log(data)
        setPurchaseOrder(data.order_number)
        setVendorName(data.vendor.name)
        setItems(data.inventory)
        setFile(data.file)
        setLoading(false)

    }catch(error){
        console.log(error)
    }
  }


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
    field: keyof PurchaseItem,
    value: any
  ): void => {
    const updatedItems = [...items];

    switch (field) {
      case "inventory_id":
        updatedItems[index][field] = value as string;    
        break;
    case "quantity":
        updatedItems[index][field] = parseInt(value) as number;
        break;
    case "price":
        updatedItems[index][field] = parseFloat(value) as number;
        break;
      default:
        break;
    }
    setItems(updatedItems);
  };

  
  const handleAddInventoryItem = (): void => {
    setItems([
      ...items,
      { inventory_id:"", quantity:0, price:0 },
    ]);
  };

  const handleRemoveInventoryItem = async(index: number, id: string) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    await axios.delete(`/api/purchase/item/${id}`)
  };

  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(routeParam?.locale || "en");
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  }
  
  
  const handleSubmit = async (event:any) => {
    event.preventDefault();

    try {
      const formData:FormData = {
        file,
        //@ts-ignore
        items, 
        vendor,
        order_number
      };
      if (items.length ===1){
        for(const item of items){
          if(item.id === ""){
            return
          }
        }
      }
      const response = await axios.put(`/api/purchase/${routeParam?.id}`, formData);
      setLoading(true)
      router.push('/dashboard/purchases')
    } catch (error) {

      console.error("Save error:", error);
    }
  };

  useEffect(() => {
    dictionary();
    fetchPurchaseOrder();
  }, []);

  const pages: Page[] = [
    {
      name: dict?.Purchases ||"Purchase",
      href: `/${routeParam?.locale || "en"}/dashboard/purchase`,
    },
    {
      name: dict?.Form || "Form",
      href: `/${routeParam?.locale || "en"}/purchase/create`,
    },
  ];

  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.purchaseFormHeading ||"Purchase Form"} />
      <div className="bg-white rounded-md w-full p-4 dark:bg-black">
        <div className=" mb-4">
          <p className="text-md font-semibold ">
          {dict?.purchaseFormSubheading ||" Fill in the form to register an purchase."}
          </p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="vendor-name">
                    <label className="text-sm font-semibold" htmlFor="vendor-name">{dict?.vendorName ||"Vendor Name"}</label>
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
                <label className="text-sm font-semibold" htmlFor="purchase-order">{dict?.orderNumber ||"Order Number"}</label>
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
                <label className="text-sm font-semibold items-center" htmlFor="files">{dict?.attachFiles ||"Attach Files"}</label>
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
                    <div className="flex space-x-2 w-full  items-center">
                      <hr className="w-full border-b-1 border-neutral-300" />
                      <button className="text-red-500 w-1/5" onClick={() => handleRemoveInventoryItem(index, item.id)}>{dict?.removeFields ||"Remove Fields"}</button>
                    </div>
                <div className="flex flex-col gap-2">
                <div className="p-o w-full">
                <label className="text-sm font-semibold" htmlFor="purchase-order">{dict?.item ||"Item"}<span className="ml-2 text-red-600">*</span></label>
                <SelectItems onChange={(event) =>
                        handleItemChange(
                          index,
                          "inventory_id",
                          event
                        )

                      }
                      value={item.id}
                      />
                </div>
                <div className="files w-full">
                <label className="text-sm font-semibold items-center" htmlFor="quantity">{dict?.quantity ||"Quantity"}<span className="ml-2 text-red-600">*</span></label>
                    <Input
                       type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange= {(event) =>
                        handleItemChange(
                          index,
                          "quantity",
                          event.target.value
                        )
                      }
                        // onChange={handlequantityChange}
                        id="quantity"
                        className="bg-transparent"
                    />
                </div>
                <div className="files w-full">
                <label className="text-sm font-semibold items-center" htmlFor="initial_price">{dict?.sellingPrice ||"Price"}<span className="ml-2 text-red-600">*</span></label>
                    <Input
                        type="number"
                        placeholder="$ 0.0"
                        value={item.price}
                        onChange= {(event) =>
                        handleItemChange(
                          index,
                          "price",
                          event.target.value
                        )
                      }
                        id="initial_price"
                        className="bg-transparent"
                    />
                </div>
                </div>   
                </div>
                ))}
                <div
                  className="border border-[#1C40CA] border rounded-md font-semibold text-[#1C40CA] px-8 py-2 text-center cursor-pointer"
                  onClick={handleAddInventoryItem}
                >
                  + {dict?.addItems ||"Add Items"}
                </div>
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
              <button className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2" disabled>
                Loading....
              </button>
            ) : (
              <>
                <button
                  type="submit"
                  className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2"
                >
                  {dict?.submit ||"Submit"}
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