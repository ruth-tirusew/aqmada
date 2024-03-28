"use client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import { CiUser } from "react-icons/ci";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


import Image from "next/image";

import { UserType } from "@/app/types";

export const columns: ColumnDef<UserType>[] = [
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
    cell: ({ row }) =><div className="text-left flex items-center gap-2">
        
        <Avatar>
              <AvatarImage src={row.getValue("image") ?? ""} alt={row.getValue("name")? "" : "No image"} />
              <AvatarFallback>
                <CiUser className=""/>
              </AvatarFallback>
            </Avatar> {row.getValue("name")}</div>,
  },
  {
    accessorKey: "email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("email")}</div>;
    },
  },
  {
    accessorKey: "role",
    header: () => <div className="text-left">Role</div>,
    cell: ({ row }) => {
      return <div className="text-left font-medium">{row.getValue("role")}</div>;
    },
  },
];
