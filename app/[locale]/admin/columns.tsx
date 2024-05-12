"use client";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { FaUserCheck } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import axios from "axios";
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
import { WaitlistType } from "../types";
export const approveUser = async (id: string) => {
  try {
    await axios.put(`/api/waitlist/${id}`);
    window.location.reload();
  } catch (error) {
    return alert("An error has occured.");
  }
};
export const columns: ColumnDef<WaitlistType>[] = [

  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-left">{row.getValue("email")}</div>,
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
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
            <AlertDialog>
            <AlertDialogTrigger asChild>
            <Button variant="outline" className={!user.approved ? "bg-white/50 transition hover:border-emerald-600 hover:text-emerald-600 gap-2 text-emerald-600" : "bg-emerald-600 transition hover:border-emerald-600 gap-2 text-white"} disabled={user.approved}>
                <FaUserCheck className={`h-4 w-4 cursor-pointer`} />
                <div className="capitalize">{user.approved ? "Approved" : "Approve"}</div>
            </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to approve this user?</AlertDialogTitle>
                <AlertDialogDescription>
                Once approved, the user will gain access to the system and its features.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => approveUser(user.id)} className="bg-emerald-500 px-4 py-2 text-white transition hover:bg-emerald-600">Continue</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> 
      )
    },
  },
]
