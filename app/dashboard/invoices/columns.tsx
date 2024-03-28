"use client";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { TbPencil } from "react-icons/tb";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Invoice, Item } from "@/app/types";
import axios from "axios";
import { Checkbox } from "@radix-ui/react-checkbox";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
export const deleteItem = async (id: string) => {
  try {
    await axios.delete(`/api/invoice/${id}`);
    window.location.reload();
  } catch (error) {
    console.error("Error creating invoice:", error);
    return alert("An error has occured.");
  }
};

export const columns: ColumnDef<Invoice>[] = [

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
    {
    accessorKey: "ref_number",
    header: () => <div className="text-left">Ref No.</div>,
    cell: ({ row }) => {
      return <Link href={`/dashboard/invoices/${row.original.id}`} className="text-left text-indigo-500 font-medium cursor-pointer">#{row.getValue("ref_number")}</Link>
    },
  },
  {
    accessorKey: "customer_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Customer
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("customer_name")}</div>,
  },
  // {
  //   accessorKey: "quantity",
  //   header: () => <div className="text-left">quantity</div>,
  //   cell: ({ row }) => {
  //     const quantity = parseFloat(row.getValue("quantity"))

  //     return <div className="text-left font-medium">{quantity}</div>
  //   },
  // },
  // {
  //   accessorKey: "price",
  //   header: () => <div className="text-left">Price</div>,
  //   cell: ({ row }) => {
  //     const price = parseFloat(row.getValue("price"))

  //     // Format the quantity as a dollar quantity
  //     const formatted = new Intl.NumberFormat("en-US", {
  //       style: "currency",
  //       currency: "USD",
  //     }).format(price)  

  //     return <div className="text-left font-medium">{formatted}</div>
  //   },
  // },
  {
    accessorKey: "payment_status",
    header: "Payment Status",
    cell: ({ row }) => (
      <div className="capitalize">Paid</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const invoice = row.original

      return (
            <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full bg-white/90 px-2 py-2 text-gray-400 transition hover:text-red-500">
              <MdOutlineDeleteOutline className="h-4 w-4 text-red-500 cursor-pointer" />
              </Button>
               
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  invoice.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteItem(invoice.id)} className="bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> 
      )
    },
  },
]
