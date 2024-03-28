import { MdAttachMoney } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";

import TotalSales from "@/app/components/totalsales";
import TopSelling from "@/app/components/topselling";
import SalesOverview from "@/app/components/salesoverview";
import Breadcrumb from "@/app/components/breadcrumb";
import { InvoiceItemsType, InvoiceType, ItemType, Page } from "@/app/types";
import getInvoices from "../actions/getInvoices";
import getInventory from "../actions/getInventory";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "../dashboard/inventory/column";
import { Invoice } from "@prisma/client";
import Image from "next/image";




const pages: Page[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
];

export default async function Dashboard() {
  let invoices: any[] = [];
  let products: ItemType[] = [];
  

  try {
    invoices = await getInvoices();
    products = await getInventory();
    console.log(invoices);
  } catch (error) {
    console.log(error);
  }
  const total = invoices?.reduce((acc: number, invoice: any) => {
    console.log(invoice);
    const salequantity =
      invoice.inventory?.reduce((inventoryAcc: number, item: any) => {
        const sellingPrice = item.selling_price;
        const quantity = item.quantity;
        return inventoryAcc + sellingPrice * quantity;
      }, 0) ?? 0;
    return acc + salequantity;
  }, 0);
  const totalProducts = products?.reduce((acc: number, item: any) => {
    return acc + item.quantity;
  }, 0);

  const totalProfit = invoices?.reduce((acc: number, invoice: InvoiceItemsType) => {
    const salequantity =
      invoice.items ?.reduce((inventoryAcc: number, item: any) => {
        const sellingPrice = item.selling_price;
        const quantity = item.quantity;
        return (
          inventoryAcc +
          sellingPrice * quantity -
          item.initial_price * quantity
        );
      }, 0) ?? 0;
    return acc + salequantity;
  }, 0);

  const todaySales = invoices?.reduce((acc: number, invoice: any) => {
    const today = new Date();
    const salequantity =
      invoice.inventory?.reduce((inventoryAcc: number, item: any) => {
        if (
          new Date(invoice.created_at).toDateString() === today.toDateString()
        ) {
          const sellingPrice = item.selling_price;
          const quantity = item.quantity;
          return inventoryAcc + sellingPrice * quantity;
        } else {
          return inventoryAcc;
        }
      }, 0) || 0;
    return acc + salequantity;
  }, 0);
  return (
    <main className="grid-cols-1 gap-4">
      <Breadcrumb page={pages} heading="Overview" />
      <div className="grid lg:grid-cols-4 gap-2 grid-cols-2">
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex align-center py-4 gap-4">
            <div className="rounded-full bg-[#00A0EA]/[10%]  text-[#1C40CA] text-center p-4 dark:bg-[#00A0EA]/[20%]">
              <IoCalendarOutline />
            </div>
            <div className="">
              <p className="text-md">$ {todaySales} </p>
              <p className="text-sm text-gray-500 dark:text-white">Today&apos;s Sales</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center pl-2 dark:text-white dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#6E13DF]/[10%] text-[#6E13DF] p-4 dark:bg-[#6E13DF]/[20%]">
              <FaChartLine />
            </div>
            <div className="">
              <p className="text-md">$ {total}</p>
              <p className="text-sm text-gray-500 dark:text-white">Total Revenue</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#C8895D]/[10%] text-[#C8895D] p-4 dark:bg-[#C8895D]/[20%]">
              <MdAttachMoney />
            </div>
            <div className="">
              <p className="text-md">$ {totalProfit}</p>
              <p className="text-sm text-gray-500 dark:text-white">Total Profit</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#FB407D]/[10%] text-[#FB407D] p-4 ">
              <CiShoppingBasket />
            </div>
            <div className="">
              <p className="text-md">{totalProducts}</p>
              <p className="text-sm text-gray-500">Products</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex lg:flex-row flex-col gap-2 mt-4">
        <div className="w-full">
          <TotalSales />
        </div>
        <div className="lg:w-[33%] w-full">
          <SalesOverview items={products} />
        </div>
      </div>
      <div className="">
      <DataTable
                columns={columns}
                data={[...products]} 
                search={"name"}
                button={false}
                title={"Inventory Items"}
                />
      </div> 
    </main>
  );
}
