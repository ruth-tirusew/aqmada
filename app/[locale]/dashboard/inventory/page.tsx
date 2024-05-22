import Breadcrumb from "@/app/[locale]/components/breadcrumb"
import { Page } from "@/app/[locale]/types"
import {DataTable} from "@/components/ui/datatable"
import {columns} from './column'
import getInventory from "@/app/actions/getInventory"
import {getDictionary} from "@/lib/locales";

import { Button } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";

// @ts-ignore
export default async function Dashboard({ params: { locale } }) {
    const data = await getInventory()
    const dict = await getDictionary(locale);

    const pages: Page[] = [
        {
            name: dict.Dashboard,
            href: `/${locale}/dashboard`,
        },
        {
            name: dict.Inventory,
            href: `/${locale}/dashboard/inventory`,
        },
    ];


    return (
        <div className="h-screen">
            <div className="flex justify-between items-center">
            <Breadcrumb page={pages} heading={dict.Inventory} subheading={dict.inventorySubheading} />
            </div>
            <DataTable
                columns={columns}
                data={[...data]} 
                search={"name"}
                searchPlaceholder={dict.Search}
                button={true}
                buttonObj={{
                name: dict.addProduct,
                url: `/${locale}/dashboard/inventory/create`,
                }}
                upload={true}
                />
        </div>
    )
}
