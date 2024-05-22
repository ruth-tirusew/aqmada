"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page, InvoiceItemsType, InvoiceItemForm } from "@/app/[locale]/types";
import { useParams, useRouter } from "next/navigation";
import { ItemType } from "@/app/[locale]/types";
import { PaymentStatus } from "@prisma/client";

import SelectItems from "@/app/[locale]/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AiOutlineClose } from "react-icons/ai";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/locales";
interface FormData {
  customer_name: string;
  payment_status: PaymentStatus;
  inventory_items: InvoiceItemForm[];
}

export default function Invoices() {
  const [customer_name, setCustomerName] = useState<string>("");
  const [payment_status, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PAID);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [dict, setDict] = useState<any>();
  const [total, setTotal] = useState<number>(0);

  const routeParam = useParams<{ id: string, locale: "en" |"am" }>();
  
  const [inventory_items, setInventoryItems] = useState<InvoiceItemForm[]>([
    { inventory_id: "", quantity: 0, selling_price: 0 },
  ]);
  const router = useRouter();
  const handleNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setCustomerName(event.target.value);
  };

  // const handlePaymentStatusChange = (
  //   event: ChangeEvent<HTMLInputElement>
  // ): void => {
  //   setPaymentStatus(event.target.checked);
  // };

  const handleInventoryItemChange = (
    index: number,
    field: keyof InvoiceItemsType,
    value: any
  ): void => {
    const updatedItems = [...inventory_items];

    switch (field) {
      case "inventory_id":
        updatedItems[index][field] = value as string;
        break;
      case "invoice_id":
        updatedItems[index][field] = value as string;
        break;
      case "quantity":
      case "selling_price":
        updatedItems[index][field] = value as number;
        break;
      default:
        break;
    }

    setInventoryItems(updatedItems);
  };

  const handleAddInventoryItem = (): void => {
    setInventoryItems([
      ...inventory_items,
      { inventory_id: "", quantity: 0, selling_price: 0 },
    ]);
  };

  const handleRemoveInventoryItem = (index: number): void => {
    const updatedItems = inventory_items.filter((_, i) => i !== index);
    setInventoryItems(updatedItems);
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    setPaymentStatus(PaymentStatus.PAID);

    try {
      const formData: FormData = {
        customer_name,
        payment_status,
        inventory_items,
      };
      setLoading(true)
      await axios.post("/api/invoice", formData);
      router.push("/dashboard/invoices");
      setLoading(false)
    } catch (error:any) {
      if (error.response.status === 400){
        setError(error.response.data.message)
        setLoading(false)
        setTimeout(() => {
          setError("")
        }, 5000);
        return
      }
      if(error.response.status === 403){
        router.push(`/${routeParam?.locale || "en"}/dashboard/403`);
      }
      setError("Something went wrong")
      setLoading(false)
      setTimeout(() => {
        setError("")
      }, 5000);
    }
  };
  useEffect(() => {
  const loadDictionary = async () => {
    try {
      const data = await getDictionary(routeParam?.locale || "en");
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };
  loadDictionary();
    let total = 0;
    inventory_items.forEach((item) => {
      total += item.quantity * item.selling_price;
    });
    if(total > 0 && typeof total === "number"){
      setTotal(total)
    }else{
      setTotal(0)
    }
   
  }, [routeParam?.id, routeParam?.locale, inventory_items]);


  const pages: Page[] = [
    {
      name: dict?.invoice ||"Invoice",
      href: `/${routeParam?.locale}/dashboard/invoices`,
    },
    {
      name: dict?.Form || "Form",
      href: `/${routeParam?.locale}/dashboard/invoices/create`,
    },
  ];


  return (
    <div className="h-screen">
      <Breadcrumb page={pages} heading={dict?.invoiceFormHeading || "Invoice Form"} />
      <div className="bg-white dark:bg-black rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold ">
          {dict?.invoiceFormSubheading || "Fill in the form to register an invoice."}
          </p>
        </div>
        <div className={`border-2 border-[#1C40CA] rounded-md py-4 px-2 flex justify-center items-center my-4 ${loading ? 'block' : 'hidden'}`}>
              <PiSpinner className="h-6 w-6 mr-2 animate-spin dark:text-white text-[#1C40CA]" />
              {dict?.loading}....

       </div>
        <form onSubmit={handleSubmit}>

        {error && (
                <div className="bg-red-100/[0.2] rounded-md p-2 border-2 border-red-500">
                  <p className="text-red-500 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">{dict?.customerName || "Customer Name"}</label>
                <input
                  type="text"
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1 bg-transparent"
                  value={customer_name}
                  onChange={handleNameChange}
                />
              </div>
              {inventory_items?.map((item, index) => (
                <div key={index} className="w-full flex w-full align-center  border border-neutral-300 rounded-sm p-2">
                  <div className=" border-r-[1px] grid grid-cols-1 gap-2 border-gray-200 p-2 w-full">
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">{dict?.item || "Item"}</label>
                    <SelectItems onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "inventory_id",
                          event
                        )

                      }
                      value={item.inventory_id}
                      />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">
                    {dict?.quantity || "Quantity"}</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "quantity",
                          parseInt(event.target.value)
                        )
                      }
                      className="bg-transparent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">{dict?.sellingPrice ||"Selling Price"}</label>
                    <Input
                      type="number"
                      value={item.selling_price}
                      onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "selling_price",
                          parseInt(event.target.value)
                        )
                      }
                      className="bg-transparent"
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
              ))}
              <div className="flex  gap-1 w-full justify-end p-2 border-t-[1px] border-neutral-300">
                <p className="text-md font-semibold"> {dict?.total || "Total"}:</p>
                <p>
                {total} ETB
                </p>

              </div>
            </div>
          </div>
          <button
                  type="button"
                  className="border border-[#1C40CA] border rounded-md  text-[#1C40CA] px-8 py-2 my-4"
                  onClick={handleAddInventoryItem}
                >
                  + {dict?.addItems || "Add Items"}
                </button>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              disabled={loading}
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
