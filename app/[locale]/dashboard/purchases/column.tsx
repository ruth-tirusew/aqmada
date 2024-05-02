"use client"

import { ColumnDef } from "@tanstack/react-table";

import { MdOutlineDeleteOutline } from "react-icons/md";
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
import { Button } from "@/components/ui/button"

import axios from 'axios'
import Link from "next/link";


async function DeletePurchase (id: string) {
        try {
            await axios.delete(`/api/purchase/${id}`)
            window.location.reload()
        } catch (error) {
        }
    
}

export const ItemCategoryColumn: ColumnDef<any>[] = [
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
    // enableSorting: false,
    // enableHiding: false,
  },
    {
        header: "Order Number",
        accessorKey: "order_number",
        cell: ({ row }) => {
          return <Link href={`/dashboard/purchases/${row.original.id}`} className="text-left text-indigo-500 font-medium cursor-pointer">#{row.getValue("order_number")}</Link>
        },
    },
    {
        header: "Order Date",
        accessorKey: "created_at",
    },


    // {
    //     header: "",
    //     accessorKey: "itemCategory",
    // },
    {
        id: "actions",
        cell: ({ row }) => {
          const purchase = row.original
     
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
                  purchase.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => DeletePurchase(purchase.id)} className="bg-red-500 px-4 py-2 text-white transition hover:bg-red-600">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> 
          )
      },
    }
]
