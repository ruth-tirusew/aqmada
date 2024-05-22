"use client";
import React from "react";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import getFilteredInvoices from "@/app/lib/utils/getFilteredInvoices";
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
} from "@/components/ui/dropdown-menu";

import { CiFilter } from "react-icons/ci";
import { FiDownload } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/locales";
import base64Img from "@/public/images/document.jpg";

// @ts-ignore
export default function Report({ params: { locale } }) {
  const [report, setReport] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<string>("month");

  const pdf_columns = [["Item", "Quantity", "Price", "Profit Margin"]];

  const report_body: any[][] = [];

  const downloadPdf = () => {
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "letter",
    });

    report.forEach((rep) => {
      report_body.push([
        rep.item_name,
        rep.quantity,
        rep.price,
        rep.profit_margin,
      ]);
    });

    autoTable(doc, {
      head: pdf_columns,
      body: report_body,
      willDrawPage: function (data) {
        // Header
        doc.setFontSize(20);
        doc.setTextColor(40);
        doc.addImage(
          "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA8AAD/4QMxaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzA2NyA3OS4xNTc3NDcsIDIwMTUvMDMvMzAtMjM6NDA6NDIgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkE5MDM4OEY5Q0QxNDExRTZBNjVDQ0Q3N0MyOUNFMUNBIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkE5MDM4OEZBQ0QxNDExRTZBNjVDQ0Q3N0MyOUNFMUNBIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QTkwMzg4RjdDRDE0MTFFNkE2NUNDRDc3QzI5Q0UxQ0EiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QTkwMzg4RjhDRDE0MTFFNkE2NUNDRDc3QzI5Q0UxQ0EiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBQQGBQUGCQYF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",
          "JPEG",
          data.settings.margin.left,
          15,
          20,
          20
        );
        doc.text("Sales Report", data.settings.margin.left + 34, 34);
      },
    });

    doc.save("sales_report.pdf");
  };

  const memoizedGetFilteredInvoices = React.useMemo(() => {
    return async (filter: any) => {
      const invoices = await getFilteredInvoices(filter || "month");
      return invoices;
    };
  }, [getFilteredInvoices]);

  useEffect(() => {
    const fetchInvoices = async () => {
      const invoices = await memoizedGetFilteredInvoices(filter);
      const newReport =
        invoices.flatMap((invoice: any) =>
          invoice.items?.map((item: any) => ({
            item_name: item.item.name,
            quantity: item.quantity,
            price: item.selling_price,
            profit_margin: (
              ((item.selling_price - item.item.initial_price) /
                item.selling_price) *
              100
            ).toFixed(2),
          }))
        ) ?? [];

      setReport(newReport);
    };

    fetchInvoices();
  }, [filter, memoizedGetFilteredInvoices]); // Update on filter change

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

  return (
    <div className="h-screen">
      <Breadcrumb
        page={pages}
        heading={dict?.salesReport}
        subheading={dict?.reportSubheading}
      />
      <div className="bg-white  dark:bg-black rounded-lg p-4 mt-8">
        <div className="flex m-4 justify-end gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-transparent text-black dark:text-white dark:hover:text-black"
            onClick={downloadPdf}
          >
            {" "}
            <FiDownload /> Download{" "}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="mr-2">
              <Button
                variant="outline"
                className="flex items-center gap-2 dark:hover:text-black bg-transparent text-black dark:text-white"
              >
                {" "}
                <CiFilter /> Filter{" "}
              </Button>
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
        <div id="sales-report">
          <DataTable
            columns={columns}
            data={report}
            search="customer_name"
            button={false}
          />
        </div>
      </div>
    </div>
  );
}
