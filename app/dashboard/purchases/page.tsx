import { Button } from "@/components/ui/button";
import { Page } from "@/app/types";

import { DataTable } from "@/components/ui/datatable";
import Breadcrumb from "@/app/components/breadcrumb";
import { ItemCategoryColumn } from "./column";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
} from "@radix-ui/react-dropdown-menu";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CiFilter } from "react-icons/ci";
import Link from "next/link";
import { Input } from "@/components/ui/input";

import getPurchaseOrders from "@/app/actions/getPurchaseOrders";

const pages: Page[] = [
  {
    name: "Purchase Order",
    href: "/dashboard/purchases",
  },
];

export default async function PurchaseOrder() {
  const data = await getPurchaseOrders();

  return (
    <div className="">
      <Breadcrumb
        page={pages}
        heading="Purchase Order"
        subheading="Report of the total purchases saved"
      />

      <DataTable
        columns={ItemCategoryColumn}
        data={[...data]}
        search={"created_at"}
        button={true}
        buttonObj={{
          name: "Add Purchase Order",
          url: "/dashboard/purchases/create",
        }}
      />
    </div>
  );
}
