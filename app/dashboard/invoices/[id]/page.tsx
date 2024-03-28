"use client";
import Breadcrumb from "@/app/components/breadcrumb";
import { Page } from "@/app/types";
import Image from "next/image";
import { IoPrintOutline } from "react-icons/io5";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

const pages: Page[] = [
  {
    name: "Invoices",
    href: "/dashboard/invoices",
  },
];

export default function InvoiceDetail() {
  const routeParam = useParams<{ id: string }>();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState(0);
  const [invoiceData, setinvoiceData] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  // const getInvoice = async () => {
  //   try {
  //   const res = await axios.get(`/api/invoice/${routeParam?.id}`);
  //   console.log(res.data);
  //   setinvoiceData(res.data);
  //   setLoading(false);
  //   getTotal();
  //   setError(null);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  useEffect(() => {
    console.log(routeParam);
    const getTotal = () => {
      let total = 0;
      invoiceData?.inventory?.map((invoice: any) => {
        total += invoice.quantity * invoice.selling_price;
      });
      setTotal(total);
    };

    const getInvoice = async () => {
      try {
        const res = await axios.get(`/api/invoice/${routeParam?.id}`);
        console.log(res.data);
        setinvoiceData(res.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.log(error);
      }
    };

    if (routeParam) {
      getInvoice();
    }

    if (invoiceData) {
      getTotal();
    }
  }, [invoiceData, routeParam]);

  // print invoice

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="">
      <Breadcrumb page={pages} heading="Invoice Details" />
      <div className="flex gap-4 print:w-full">
        <div
          className="bg-white rounded-md w-full p-4 shadow-sm"
          ref={invoiceRef}
        >
          <div className="flex justify-end mb-4"></div>
          <div className="flex items-center px-4 border-gray-200 border-b-[1px] py-4 mb-2">
            <Image src="/aqmada-01.png" width={100} height={70} alt="logo" />
            <div className="ml-auto">
              <div className="flex">
                <div className="font-semibold text-md text-neutral-700">
                  Invoice:
                </div>
                <div className="font-light text-md text-neutral-700 ml-2">
                  {loading ? (
                    <div className="animate-pulse w-12 h-6 bg-gray-100 rounded-full"></div>
                  ) : (
                    <div>
                      <span>#{invoiceData.ref_number.slice(0, 15)}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex">
                <div className="font-semibold text-md text-neutral-700">
                  Date Issued:
                </div>
                <div className="font-light text-md text-neutral-700 ml-2">
                  {loading ? (
                    <div className="animate-pulse w-12 h-6 bg-gray-100 rounded-full"></div>
                  ) : (
                    <div>
                      <span>{invoiceData.created_at.slice(0, 10)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Item</TableHead>
                <TableHead>quantity</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center animate-pulse">
                  <span>Loading...</span>
                </TableCell>
              </TableRow>
            ) : (
              <TableBody>
                {invoiceData?.inventory?.map((invoice: any) => (
                  <TableRow key={invoice.id}>
                    <TableCell>{invoice.Inventory.name}</TableCell>
                    <TableCell>{invoice.quantity}</TableCell>
                    <TableCell>{invoice.selling_price}</TableCell>
                    <TableCell className="text-right">
                      {invoice.quantity * invoice.selling_price}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">{total}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
        <div className="w-[30%] p-4 flex flex-col gap-4 print:hidden">
          <button
            className="flex items-center border-2 gap-1 rounded-sm border-[#1C40CA] font-medium text-[#1C40CA] text-md px-6 py-2 hover:bg-gray-200/[30%]"
            onClick={() => {
              handlePrint();
            }}
          >
            <IoPrintOutline />
            <span>PrintInvoice</span>
          </button>
          <button className="border-2 gap-1 rounded-sm border-[#1C40CA] font-medium text-[#1C40CA] text-md  px-8 py-2 hover:bg-gray-200/[30%]">
            <span>Edit Invoice</span>
          </button>
        </div>
      </div>
    </div>
  );
}
