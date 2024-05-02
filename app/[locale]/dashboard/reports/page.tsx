'use client'
import { useEffect, useState } from 'react';
import getFilteredInvoices  from '@/app/lib/utils/getFilteredInvoices';
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { Page } from "@/app/[locale]/types";
import { DataTable } from "@/components/ui/datatable";
import { ReportType } from "@/app/[locale]/types";
import { columns } from "./column";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { CiFilter } from "react-icons/ci";
import { Button } from '@/components/ui/button';
import { getDictionary } from '@/lib/locales';
//@ts-ignore
export default function Report({params:{locale}}) {
  const [report, setReport] = useState<ReportType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string >("month");

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getFilteredInvoices(filter);
      const newReport = invoices.flatMap((invoice:any) =>
        invoice.items?.map((item: any) => ({
          item_name: item.item.name,
          quantity: item.quantity,
          price: item.selling_price,
          // round profit margin to 2 decimal places
          profit_margin:  (((item.selling_price - item.item.initial_price) / item.selling_price) * 100).toFixed(2)
        })) ?? []
      );

      setReport(newReport);
    };

    fetchInvoices();
  }, [filter]);

  const handleFilterChange = async (filter: string) => {
    setIsOpen(false);
    setFilter(filter);
  };

  const [dict, setDict] = useState<any>();

  const dictionary = async () => {
    try {
      const data = await getDictionary(locale);
      setDict(data);
    } catch (error) {
      console.error("Dictionary error:", error);
    }
  };

  
const pages: Page[] = [
  {
    name: dict?.report || "Reports",
    href: "/dashboard/reports",
  },
];

  


  useEffect(() => {
    dictionary();
  }, []);

  return (
    <div className="">
            <Breadcrumb
        page={pages}
        heading= {dict?.salesReport}
        subheading={dict?.reportSubheading}
      />
      <div className="bg-white  dark:bg-black rounded-lg p-4 mt-8">
      <div className="flex m-4 justify-end">
      <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-2">
        <Button variant="outline" className="flex items-center gap-2 bg-transparent text-black dark:text-white"> <CiFilter /> Filter </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
      <DropdownMenuGroup>
      <DropdownMenuItem onClick={() => handleFilterChange("today")}>
      Today
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("week")}>
            This Week
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange("month")}>
            This Month
            </DropdownMenuItem>
            </DropdownMenuGroup>
      </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <DataTable 
      columns={columns} data={report} search="customer_name" button={false} />
      </div>
    </div>
  );
}