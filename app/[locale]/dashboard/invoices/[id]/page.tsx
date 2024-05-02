"use client"
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page } from "@/app/[locale]/types";
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
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { getDictionary } from "@/lib/locales";
import { TbPencil } from "react-icons/tb";
import Link from "next/link";
import Logo from '@/public/aqmada-03.png'


// @ts-ignore
export default function InvoiceDetail({ params: { locale } }) {
  const routeParam = useParams<{ id: string }>();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [dict, setDict] = useState<any>();



  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/invoice/${routeParam?.id}`);
        setInvoiceData(res.data);
        setLoading(false);
        setError(null);
      } catch (error) {
        console.error(error);
        setError(error);
        setLoading(false);
      }
    };

    const loadDictionary = async () => {
      try {
        const data = await getDictionary(locale || "en");
        setDict(data);
      } catch (error) {
        console.error("Dictionary error:", error);
      }
    };

    fetchData();
    loadDictionary();
  }, [routeParam?.id, locale]);

  const total =
    invoiceData?.items?.reduce(
      (acc: number, item: any) => acc + item.quantity * item.selling_price,
      0
    ) || 0;

  const handlePrint = () => {
    window.print();
  };

  const pages: Page[] = [
    {
      name: dict?.Invoices || "Invoices",
      href: "/dashboard/invoices",
    },
    
  ];

  return (
    <div className="">
      <Breadcrumb page={pages} heading={dict?.invoiceDetails || "Invoice Details"} />
      <div className="flex gap-4 print:w-full">
        <div
          className="bg-white rounded-md w-full p-4 shadow-sm"
          ref={invoiceRef}
        >
          {loading ? (
            <div>
              {dict?.loading || "Loading..."}
            </div>
          ) : (
            <>
              <div className="flex items-center px-4 border-gray-200 border-b-[1px] py-4 mb-2">
                <Image
                  src={Logo}
                  width={100}
                  height={70}
                  alt="logo"
                />
                <div className="ml-auto">
                  <div className="flex">
                    <div className="font-semibold text-md text-neutral-700">
                      {dict?.invoice || "Invoice"}:
                    </div>
                    <div className="font-light text-md text-neutral-700 ml-2">
                      <span>#{invoiceData.ref_number.slice(0, 15)}</span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="font-semibold text-md text-neutral-700">
                      {dict?.dateIssued || "Date Issued"}:
                    </div>
                    <div className="font-light text-md text-neutral-700 ml-2">
                      <span>{invoiceData.created_at.slice(0, 10)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Item</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoiceData?.items?.map((invoice: any) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.item.name}</TableCell>
                      <TableCell>{invoice.quantity}</TableCell>
                      <TableCell>{invoice.selling_price}</TableCell>
                      <TableCell className="text-right">
                        {invoice.quantity * invoice.selling_price}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={3}>Total</TableCell>
                    <TableCell className="text-right">{total}</TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </div>
        <div className="w-[30%] p-4 flex flex-col gap-4 print:hidden">
          <button
            className="flex items-center border-2 gap-1 rounded-sm border-[#1C40CA] font-medium text-[#1C40CA] text-md px-8 py-2 hover:bg-gray-200/[30%]"
            onClick={handlePrint}
          >
            <IoPrintOutline />
            <span>{dict?.printInvoice || "Print Invoice"}</span>
          </button>
          <Link
            className=" flex items-center border-2 gap-1 rounded-sm border-[#1C40CA] font-medium text-[#1C40CA] text-md px-8 py-2 hover:bg-gray-200/[30%]"
            href={`/${locale}/dashboard/invoices/edit/${routeParam?.id}/`}
          > 
          <TbPencil />
            <span>{dict?.editInvoice || "Edit Invoice"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
