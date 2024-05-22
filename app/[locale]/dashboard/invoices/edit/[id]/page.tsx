"use client";
import React, { ChangeEvent, FormEvent, useEffect, useState, useMemo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page, InvoiceItemsType, InvoiceItemForm } from "@/app/[locale]/types";
import { useRouter, useParams } from "next/navigation";
import { ItemType } from "@/app/[locale]/types";
import { PaymentStatus } from "@prisma/client";
import { PiSpinner } from "react-icons/pi";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/locales";
import Image from "next/image";
import Logo from '@/public/aqmada-03.png'
import { AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction
} from "@radix-ui/react-alert-dialog";
import { AiOutlineClose } from "react-icons/ai";

interface FormData {
  customer_name: string;
  payment_status: PaymentStatus;
  items: InvoiceItemForm[];
}

const Invoices = () => {
  const [items, setInventoryItems] = useState<InvoiceItemForm[]>([{ inventory_id: "", quantity: 0, selling_price: 0 }]);
  const [fetchedItems, setFetchedItems] = useState<ItemType[]>([]);
  const [customer_name, setCustomerName] = useState<string>("");
  const [payment_status, setPaymentStatus] = useState<PaymentStatus>(PaymentStatus.PAID);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [refNumber, setRefNumber] = useState("");
  const [date, setDate] = useState("");
  const routeParam = useParams<{ id: string, locale: "en" | "am" }>();
  const [dict, setDict] = useState<any>();
  const router = useRouter();

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setCustomerName(event.target.value);
  }, []);

  const handleInventoryItemChange = useCallback((index: number, field: keyof InvoiceItemsType, value: any): void => {
    const updatedItems = [...items];
    if (field === "inventory_id" || field === "invoice_id") {
      updatedItems[index][field] = value as string;
    } else if (field === "quantity" || field === "selling_price") {
      updatedItems[index][field] = value as number;
    }
    setInventoryItems(updatedItems);
  }, [items]);

  const handleAddInventoryItem = useCallback((): void => {
    setInventoryItems([...items, { inventory_id: "", quantity: 0, selling_price: 0 }]);
  }, [items]);

  const handleRemoveInventoryItem = useCallback(async (index: number, id?: string) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setInventoryItems(updatedItems);
    if (id) {
      try {
        await axios.delete(`/api/invoice/item/${id}`);
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  }, [items]);

  const handleSubmit = useCallback(async (): Promise<void> => {
    setPaymentStatus(PaymentStatus.PAID);
    try {
      const formData: FormData = {
        customer_name,
        payment_status,
        items,
      };
      setLoading(true);
      await axios.put(`/api/invoice/${routeParam?.id}`, formData);
      router.push("/dashboard/invoices");
    } catch (error: any) {
      if (error.response.status === 400) {
        setError(error.response.data.message);
      } else if (error.response.status === 403) {
        router.push(`/${routeParam?.locale || "en"}/dashboard/403`);
      } else {
        setError("Something went wrong");
      }
      setLoading(false);
      setTimeout(() => setError(""), 5000);
    }
  }, [customer_name, items, payment_status, routeParam, router]);

  const pages: Page[] = useMemo(() => [
    {
      name: dict?.invoice || "Invoice",
      href: `/${routeParam?.locale}/dashboard/invoices`,
    },
    {
      name: dict?.Form || "Form",
      href: `/${routeParam?.locale}/dashboard/invoices/${routeParam?.id}`,
    },
  ], [dict, routeParam]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("/api/inventory");
        setFetchedItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch items:", error);
      }
    };

    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/api/invoice/${routeParam?.id}`);
        const data = response.data;
        setCustomerName(data?.customer_name);
        setInventoryItems(data?.items);
        setRefNumber(data.ref_number);
        setDate(data.created_at);
      } catch (error) {
        console.error("Failed to fetch invoice:", error);
      }
    };

    const fetchDictionary = async () => {
      try {
        const data = await getDictionary(routeParam?.locale || "en");
        setDict(data);
      } catch (error) {
        console.error("Failed to fetch dictionary:", error);
      }
    };

    fetchDictionary();
    fetchInvoice();
    fetchItems();
  }, [routeParam]);

  const renderItems = useMemo(() => items.map((item, index) => (
    <div key={index} className="w-full flex items-center border border-neutral-300 rounded-sm p-2">
      <div className="grid grid-cols-1 gap-2 border-r-[1px] border-gray-200 p-2 w-full">
        <div className="flex flex-col gap-1">
          <label htmlFor="item">{dict?.item || "Item"}</label>
          <Select
            onValueChange={(event) => handleInventoryItemChange(index, "inventory_id", event)}
            value={item.inventory_id}
            required
          >
            <SelectTrigger className="w-full bg-transparent">
              <SelectValue placeholder="Select item" />
            </SelectTrigger>
            {loading ? (
              <SelectContent>Loading...</SelectContent>
            ) : fetchedItems.length === 0 ? (
              <SelectContent>No items found</SelectContent>
            ) : (
              <SelectContent className="dark:bg-gray-900 dark:text-white">
                {fetchedItems.map((group) => (
                  <SelectGroup key={group.id}>
                    <SelectItem value={group.id}>{group.name}</SelectItem>
                  </SelectGroup>
                ))}
                <hr />
                <button
                  className="flex justify-center space-x-4 py-2 items-center w-full"
                  onClick={() => router.push("/dashboard/inventory/create")}
                >
                  <span className="font-semibold text-[#1C40CA] text-xl">+</span>
                  <p>Register Item</p>
                </button>
              </SelectContent>
            )}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="quantity">{dict?.quantity || "Quantity"}</label>
          <Input
            type="number"
            value={item.quantity}
            onChange={(event) => handleInventoryItemChange(index, "quantity", parseInt(event.target.value))}
            required
            className="bg-transparent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="selling_price">{dict?.sellingPrice || "Selling Price"}</label>
          <Input
            type="number"
            value={item.selling_price}
            onChange={(event) => handleInventoryItemChange(index, "selling_price", parseInt(event.target.value))}
            required
            className="bg-transparent"
          />
        </div>
      </div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full bg-white/90 dark:bg-transparent px-2 py-2 text-gray-400 transition hover:text-red-500">
            <AiOutlineClose className="text-red-500 text-sm cursor-pointer mx-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dict?.sure || "Are you sure"}?</AlertDialogTitle>
            <AlertDialogDescription>
              {dict?.sureDescription || "This action cannot be undone. This will permanently delete your record."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{dict?.cancel || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleRemoveInventoryItem(index, item.id)} className="bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">
              {dict?.continue || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )), [items, dict, loading, fetchedItems, handleInventoryItemChange, handleRemoveInventoryItem]);

  return (
    <div>
      <Breadcrumb page={pages} heading={dict?.invoiceFormHeading || "Invoice Form"} />
      <div className="bg-white dark:bg-black rounded-md w-full p-4">
        <div className="mb-4">
          <p className="text-md font-semibold">
            {dict?.invoiceFormSubheading || "Fill in the form to register an invoice"}:
          </p>
        </div>
        <div className="flex items-center sm:px-4 border-gray-200 border-b-[1px] py-4 mb-2">
          <Image src={Logo} width={100} height={70} alt="logo" />
          <div className="sm:ml-auto">
            <div className="flex">
              <div className="font-semibold font-light sm:text-md dark:text-white text-sm text-neutral-700">
                {dict?.invoice || "Invoice"}:
              </div>
              <div className="font-light font-light sm:text-md text-sm text-neutral-700 ml-2">
                <span className="dark:text-white">#{refNumber.slice(0, 15)}</span>
              </div>
            </div>
            <div className="flex">
              <div className="font-semibold font-light sm:text-md dark:text-white text-sm text-neutral-700">
                {dict?.dateIssued || "Date Issued"}:
              </div>
              <div className="font-light font-light sm:text-md text-sm text-neutral-700 ml-2">
                <span className="dark:text-white">{date.slice(0, 10)}</span>
              </div>
            </div>
          </div>
        </div>
        <form>
          <div className={`border-2 border-[#1C40CA] rounded-md py-4 px-2 flex justify-center items-center my-4 ${loading ? 'block' : 'hidden'}`}>
            <PiSpinner className="h-6 w-6 mr-2 animate-spin dark:text-white text-[#1C40CA]" />
            {dict?.loading}....
          </div>
          <p className="text-sm text-red-500 font-semibold mb-4">{error}</p>
          <div className="flex gap-4">
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label htmlFor="name">{dict?.customerName || "Customer Name"}</label>
                <input
                  type="text"
                  className="border border-neutral-300 focus:ring-0 active:ring-0 active:outline-none focus:outline-none focus:border-[#1C40CA] rounded-sm px-2 py-1 bg-transparent"
                  value={customer_name}
                  onChange={handleNameChange}
                />
              </div>
              {renderItems}
            </div>
          </div>
          <button
            type="button"
            className="border border-[#1C40CA] rounded-md text-[#1C40CA] px-4 py-2 my-4"
            onClick={handleAddInventoryItem}
          > + {dict?.addItems || "Add Items"}
          </button>
          <div className="w-full flex justify-end mt-6 mb-2 gap-2">
            <button
              type="reset"
              className="bg-[#1C40CA]/[0.05] rounded-md font-semibold text-[#1C40CA] sm:px-8 px-4 py-2"
              disabled={loading}
            >
              {dict?.reset || "Reset"}
            </button>
            <div>
              {loading ? (
                <button
                  className="bg-[#1C40CA] rounded-md font-semibold text-white sm:px-8 px-4 py-2 flex items-center"
                  disabled
                >
                  <PiSpinner className="h-4 w-4 mr-2 animate-spin text-white" />
                  {dict?.loading || "Loading"}
                </button>
              ) : (
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-[#1C40CA] rounded-md font-semibold text-white px-8 py-2"
                >
                  {dict?.submit || "Submit"}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invoices;