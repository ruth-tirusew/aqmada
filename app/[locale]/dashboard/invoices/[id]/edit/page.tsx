"use client";
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
      invoiceData?.items?.map((invoice: any) => {
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
        <h4>HERE</h4>
        </div>
    </div>
  );
}
