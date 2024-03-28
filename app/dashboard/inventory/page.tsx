import Breadcrumb from "@/app/components/breadcrumb"
import { Page } from "@/app/types"
import {DataTable} from "@/components/ui/datatable"
import {columns} from './column'
import getInventory from "@/app/actions/getInventory"

const pages:Page[] = [
    {
        name:"Inventory",
        href:"/dashboard/inventory",
    },
]

export default async function Dashboard() {
    const data = await getInventory()
    return (
        <div className="">
            <Breadcrumb page={pages} heading="Inventory" subheading="Report of the total items you have saved"/>
            <DataTable
                columns={columns}
                data={[...data]} 
                search={"name"}
                button={true}
                buttonObj={{
                name: "Add Item",
                url: "/dashboard/inventory/create",
                }}
                />
        </div>
    )
}
