"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios from "axios";
import Breadcrumb from "@/app/components/breadcrumb";
import { Page, InvoiceItemsType, InvoiceItemForm } from "@/app/types";
import { useRouter } from "next/navigation";
import { ItemType } from "@/app/types";
import { PaymentStatus } from "@prisma/client";

import SelectItems from "@/app/components/SelectItem";
import { PiSpinner } from "react-icons/pi";
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
    console.log(...inventory_items);
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
      console.log(formData.inventory_items);
      setLoading(true)
      await axios.post("/api/invoice", formData);
      router.push("/dashboard");
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
      <div className="bg-white rounded-md w-full p-4">
        <div className="heading mb-4">
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
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-sm px-2 py-1"
                  value={customer_name}
                  onChange={handleNameChange}
                />
              </div>
              {inventory_items.map((item, index) => (
                <div key={index} className="w-full flex  gap-2 align-center">
                  <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="item">Item</label>
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
                    <label htmlFor="name">Quantity</label>
                    <input
                      type="number"
                      className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-md px-2 py-1"
                      value={item.quantity}
                      onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "quantity",
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label htmlFor="name">Selling price</label>
                    <input
                      type="number"
                      className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-md px-2 py-1"
                      value={item.selling_price}
                      onChange={(event) =>
                        handleInventoryItemChange(
                          index,
                          "selling_price",
                          parseInt(event.target.value)
                        )
                      }
                    />
                  </div>
                  {/* <div className="flex flex-col gap-1">
                    <label htmlFor="name">Selling Price</label>
                    <input
                      type="text"
                      className="border-2 border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none active:ring-0 focus:border-[#1C40CA] active:border-[#1C40CA] focus:border-black rounded-md px-2 py-1"
                      value={item.selling_price}
                      onChange={handleNameChange}
                    />
                  </div> */}

                  <button
                    type="button"
                    onClick={handleAddInventoryItem}
                    className="pt-4"
                  >
                    <span className="text-green-400 text-3xl">+</span>
                  </button>
                  <button
                    type="button"
                    className="pt-4"
                    onClick={() => handleRemoveInventoryItem(index)}
                  >
                    <span className="text-red-400 text-3xl">-</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
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
                  <PiSpinnerclassName="h-4 w-4 mr-2 animate-spin text-white" />
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
