'use client'
import React, { ChangeEvent, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { ItemType, Page } from "@/app/[locale]/types";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";


import SelectItems from "@/app/[locale]/components/SelectItem";
import ImageUpload from "@/app/[locale]/components/image";

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
export default function PurchaseOrderForm({params:{locale}}) {
  const [order_number, setPurchaseOrder] = useState("");
  const [file, setFile] = useState("");
  const [vendor, setVendorName] = useState("");
  const [loading, setLoading] = useState(false);
  const[items, setItems] = useState<Item[]>([
    { id:"", name: "", image:"", quantity: 0, initial_price: 0, },
  ])
  const router = useRouter()

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
        updatedItems[index][field] = value as number;
        break;
      case "initial_price":
        updatedItems[index][field] = value as number;
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
     await axios.post("/api/purchase", formData);
      setLoading(true)
      router.push('/dashboard/purchases')
    } catch (error:any) {
      if(error.response.status === 403){
        router.push(`/${locale || "en"}/dashboard/403`);
      }
    }
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading="Purchase Form" />
      <div className="bg-white rounded-md w-full p-4 dark:bg-black">
        <div className=" mb-4">
          <p className="text-md font-semibold ">
            Fill in the form to register an purchase.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-4">
                <div className="vendor-name">
                    <label className="text-sm font-semibold" htmlFor="vendor-name">Vendor Name</label>
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
                <label className="text-sm font-semibold" htmlFor="purchase-order">Order Number</label>
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
                <label className="text-sm font-semibold items-center" htmlFor="files">Attach Files</label>
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
                      <div className="w-full border border-gray-400 my-4"></div>
                      <button className="text-red-500 w-1/5" onClick={() => handleRemoveInventoryItem(index)}>Remove Fields</button>
                    </div>
                <div className="grid grid-cols-2 gap-4 items-center w-full">
                <div className="">
                <div className="">
                <ImageUpload onChange={(event) =>
                        handleItemChange(
                          index,
                          "image",
                          event
                        )
                      } value={item.image || ""} 
                      locale={locale}
                      />
                </div>
                </div>
                <div className="flex flex-col gap-2">
                <div className="p-o w-full">
                <label className="text-sm font-semibold" htmlFor="purchase-order">Item<span className="ml-2 text-red-600">*</span></label>
                <SelectItems onChange={(event) =>
                        handleItemChange(
                          index,
                          "id",
                          event
                        )
                      }
                      value={item.id}
                      />
                </div>
                <div className="files w-full">
                <label className="text-sm font-semibold items-center" htmlFor="quantity">Quantity<span className="ml-2 text-red-600">*</span></label>
                    <Input
                        placeholder="0"
                        value={item.quantity}
                        onChange= {(event) =>
                        handleItemChange(
                          index,
                          "quantity",
                          parseInt(event.target.value)
                        )
                      }
                        // onChange={handlequantityChange}
                        id="quantity"
                        className="bg-transparent"
                    />
                </div>
                <div className="files w-full">
                <label className="text-sm font-semibold items-center" htmlFor="initial_price">Price<span className="ml-2 text-red-600">*</span></label>
                    <Input
                        type="number"
                        placeholder="$ 0.0"
                        value={item.initial_price}
                        onChange= {(event) =>
                        handleItemChange(
                          index,
                          "initial_price",
                          parseFloat(event.target.value)
                        )
                      }
                        id="initial_price"
                        className="bg-transparent"
                    />
                </div>
                </div>   
                </div>
                  </div>
                ))}
                <button
                  className="border border-[#1C40CA] border rounded-md font-semibold text-[#1C40CA] px-8 py-2"
                  onClick={handleAddInventoryItem}
                >
                  + Add Items
                </button>
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
              <button className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2" disabled>
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