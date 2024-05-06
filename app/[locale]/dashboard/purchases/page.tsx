import { Button } from "@/components/ui/button";
import { Page } from "@/app/[locale]/types";

import { DataTable } from "@/components/ui/datatable";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
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
import { getDictionary } from "@/lib/locales";


// @ts-ignore
export default async function PurchaseOrder({ params: { locale } }) {
  const data = await getPurchaseOrders();
  const dict = await getDictionary(locale);
  
const pages: Page[] = [
  {
    name: dict.Purchases,
    href: "/dashboard/purchases",
  },
];
  return (
    <div className="h-screen">
      <Breadcrumb
        page={pages}
        heading= {dict.POHeading}
        subheading= {dict.POSubheading}
      />

      <DataTable
        columns={ItemCategoryColumn}
        data={[...data]}
        search={"created_at"}
        button={true}
        buttonObj={{
          name: dict.addPO,
          url: `/${locale}/dashboard/purchases/create`,
          }}
      />
    </div>
  );
}
