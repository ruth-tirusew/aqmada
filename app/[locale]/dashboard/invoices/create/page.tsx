"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page, InvoiceItemsType, InvoiceItemForm } from "@/app/[locale]/types";
import { useRouter } from "next/navigation";
import { ItemType } from "@/app/[locale]/types";
import { PaymentStatus } from "@prisma/client";

import SelectItems from "@/app/[locale]/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AiOutlineClose } from "react-icons/ai";
import { Input } from "@/components/ui/input";
interface FormData {
  customer_name: string;
  payment_status: PaymentStatus;
  inventory_items: InvoiceItemForm[];
}

export default function Invoices() {
  const pages: Page[] = [
    {
      name: "Invoice",
      href: "/dashboard/invoices",
    },
    {
      name: "Form",
      href: "/dashboard/invoices/create",
    },
  ];
  const [customer_name, setCustomerName] = useState<string>("");
  const [payment_status, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PAID);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
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
    console.log(updatedItems);

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
      setError("Something went wrong")
      setLoading(false)
      setTimeout(() => {
        setError("")
      }, 5000);
    }
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading="Invoice Form" />
      <div className="bg-white dark:bg-black rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold ">
            Fill in the form to register an invoices.
          </p>
        </div>
        <form onSubmit={handleSubmit}>

          <p className="text-sm text-red-500 font-semibold mb-4">
            {error}
          </p>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">Customer Name</label>
                <input
                  type="text"
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1 bg-transparent"
                  value={customer_name}
                  onChange={handleNameChange}
                />
              </div>
              {inventory_items.map((item, index) => (
                <div key={index} className="w-full flex  gap-2 align-center">
                  <Table className=" border-r-[1px] border-gray-200">
                  <TableHeader>
                  <TableRow>
                    <TableHead className="">Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    {/*
                    <TableHead className="text-right">Total</TableHead> */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                      <TableCell>
                      <SelectItems onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "inventory_id",
                          event
                        )

                      }
                      value={item.inventory_id}
                      />
                      </TableCell>
                      <TableCell>
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
                    />
                      </TableCell>
                      <TableCell> 
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
                    />

                      </TableCell>
                      </TableRow>
                      </TableBody>
                  </Table>
                  <button
                    type="button"
                    className="pt-4"
                    onClick={() => handleRemoveInventoryItem(index)}
                  >
                     <AiOutlineClose className="text-red-500 text-sm cursor-pointer mx-4"/>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
                  type="button"
                  className="border border-[#1C40CA] border rounded-md  text-[#1C40CA] px-8 py-2"
                  onClick={handleAddInventoryItem}
                >
                  + Add Items
                </button>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semiboldtext-[#1C40CA] px-8 py-2"
              disabled={loading}
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
