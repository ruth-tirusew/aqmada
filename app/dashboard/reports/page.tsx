'use client'
import { useEffect, useState } from 'react';
import getFilteredInvoices  from '@/app/lib/utils/getFilteredInvoices';
import Breadcrumb from "@/app/components/breadcrumb";
import { Page } from "@/app/types";
import { getProfitMargin } from "@/app/lib/utils/getProfitMargin";
import { DataTable } from "@/components/ui/datatable";
import { ReportType } from "@/app/types";
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

const pages: Page[] = [
  {
    name: "Report",
    href: "/dashboard/reports",
  },
];

export default function Report() {
  const [report, setReport] = useState<ReportType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await getFilteredInvoices(filter);
      const newReport = invoices.flatMap((invoice:any) =>
        invoice.inventory?.map((item: any) => ({
          item_name: item.Inventory.name,
          quantity: item.quantity,
          price: item.selling_price,
          profit_margin: getProfitMargin(item.selling_price, item.Inventory.initial_price),
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

  return (
    <div className="">
            <Breadcrumb
        page={pages}
        heading="Sales Report"
        subheading="Report of the total invoices saved"
      />
      <div className="bg-white rounded-lg p-4 mt-8">
      <div className="flex m-4 justify-end">
      <DropdownMenu>
      <DropdownMenuTrigger asChild className="mr-2">
        <Button variant="outline" className="flex items-center gap-2"> <CiFilter /> Filter </Button>
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