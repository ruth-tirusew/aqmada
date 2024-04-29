"use client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";

import { ReportType } from "@/app/[locale]/types";


export const columns: ColumnDef<ReportType>[] = [
  {
    accessorKey: "item_name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Item
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("item_name")}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-left">Quantity</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("quantity")}</div>;
    },
  },
  {
    accessorKey: "price",
    header: () => <div className="text-left">Price</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">${row.getValue("price")}</div>;
    },
  },
  {
    accessorKey: "profit_margin",
    header: () => <div className="text-left">Profit Margin</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("profit_margin")}</div>;
    },
  },
];
