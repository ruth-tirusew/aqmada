import { MdAttachMoney } from "react-icons/md";
import { FaChartLine } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { CiShoppingBasket } from "react-icons/ci";
import TotalSales from "@/app/[locale]/components/totalsales";
import SalesOverview from "@/app/[locale]/components/salesoverview";
import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { InvoiceItemsType, InvoiceType, ItemType, Page } from "@/app/[locale]/types";
import getInvoices from "../../actions/getInvoices";
import getInventory from "../../actions/getInventory";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "../dashboard/inventory/column";

import {getDictionary} from "@/lib/locales";


// @ts-ignore
async function Dashboard({ params: { locale } }) {
  // const locale = 'en';
  const dict = await getDictionary(locale);
  let invoices: any[] = [];
  let products: ItemType[] = [];

  const dataTableColumns = {
    name: dict.datatable.name,
    quantity: dict.datatable.quantity,
    initial_price: dict.datatable.initialPrice,
    selling_price: dict.datatable.sellingPrice
  }


  const salesOverviewNames={
    lowStockItems: dict["Low Stock Items"],
    totalItems: dict.totalItems,
    noItems: dict.noItems
  
  }

  
const pages: Page[] = [
  {
    name: dict.Dashboard,
    href: "/dashboard",
  },
];

  try {
    invoices = await getInvoices();
    products = await getInventory();
  } catch (error) {
  }
  const total = invoices?.reduce((acc: number, invoice: any) => {
    const salequantity =
      invoice.items?.reduce((inventoryAcc: number, item: any) => {
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
          item.item.initial_price * quantity
        );
      }, 0) ?? 0;
    return acc + salequantity;
  }, 0);

  const todaySales = invoices?.reduce((acc: number, invoice: any) => {
    const today = new Date();
    const salequantity =
      invoice.items?.reduce((inventoryAcc: number, item: any) => {
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
    <main className="h-screen grid-cols-1 gap-4">
      <Breadcrumb page={pages} heading= {dict.Overview} />
      <div className="grid lg:grid-cols-4 gap-2 grid-cols-2">
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#00A0EA]/[10%] text-[#00A0EA] p-4 dark:bg-[#00A0EA]/[20%]">
              <IoCalendarOutline />
            </div>
            <div className="">
              <p className="text-md">$ {todaySales} </p>
              <p className="text-sm text-gray-500 dark:text-white">{dict.todaysSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center pl-2 dark:text-white dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#6E13DF]/[10%] text-[#6E13DF] text-center w-12 h-12 p-4 flex items-center justify-center dark:bg-[#6E13DF]/[20%]">
              <FaChartLine />
            </div>
            <div className="">
              <p className="text-md">{total} ETB</p>
              <p className="text-sm text-gray-500 dark:text-white">{dict.totalSales}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex items-center py-4 gap-2">
            <div className="rounded-full bg-[#C8895D]/[10%] text-[#C8895D] text-center w-12 h-12 p-4 flex items-center justify-center dark:bg-[#C8895D]/[20%]">
              <span>
                <MdAttachMoney />
              </span>
            </div>
            <div className="">
              <p className="text-md">{totalProfit < 0 ? 0 : totalProfit } ETB</p>
              <p className="text-sm text-gray-500 dark:text-white">{dict.totalProfit}</p>
            </div>
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg items-center px-2 dark:bg-black">
          <div className="flex align-center py-4 gap-2">
            <div className="rounded-full bg-[#FB407D]/[10%] text-[#FB407D] text-center w-12 h-12 p-4 flex items-center justify-center">
              <CiShoppingBasket />
            </div>
            <div className="">
              <p className="text-md">{totalProducts}</p>
              <p className="text-sm text-gray-500">{dict.Products}</p>
            </div>
          </div>
        </div>    
      </div>
      <div className="flex lg:flex-row flex-col gap-2 mt-4">
        <div className="w-full">
          <TotalSales name={dict.totalSales} invoice={invoices}/>
        </div>
        <div className="lg:w-[33%] w-full">
          <SalesOverview items={products} names={salesOverviewNames}/>
        </div>
      </div>
      <div className="">
      <DataTable
                columns={columns}
                data={[...products]} 
                search={"name"}
                button={false}
                title= {dict.Inventory}
                />
      </div> 
    </main>
  );
}

export default Dashboard;