"use client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
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
} from "@/components/ui/alert-dialog";

import { MdOutlineDeleteOutline } from "react-icons/md";
import { TbPencil } from "react-icons/tb";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { ItemType } from "@/app/[locale]/types";
import axios from "axios";
import {getDictionary} from "@/lib/locales";
import { useParams } from "next/navigation";


const deleteItem = async (id: string) => {
  try {
    await axios.delete(`/api/inventory/${id}`);
    window.location.reload();
  } catch (error) {
    console.error("Error creating invoice:", error);
    return alert("An error has occured.");
  }
};





export const columns: ColumnDef<ItemType>[] = [  
  {
    accessorKey: "name",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-left">Quantity</div>,
    cell: ({ row }) => {
      const quantity = parseFloat(row.getValue("quantity"));

      return <div className="text-left font-medium">{quantity}</div>;
    },
  },
  {
    accessorKey: "initial_price",
    header: () => <div className="text-left">Initial Price</div>,
    cell: ({ row }) => {
      const initial_price = parseFloat(row.getValue("initial_price"));
      return <span className="text-left font-medium">{initial_price} ETB</span>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex space-x-2">
            <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/90 px-2 py-2 text-gray-400 transition hover:text-blue-500"
                onClick={()=>{
                  window.location.href = `${item.id}`;
                }}
              >
                <TbPencil className="h-4 w-4 text-blue-500 cursor-pointer"/>
            </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full bg-white/90 px-2 py-2 text-gray-400 transition hover:text-red-500"
              >
                <MdOutlineDeleteOutline className="h-4 w-4 text-red-500 cursor-pointer" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your item.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => deleteItem(item.id)}
                  className="bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];
