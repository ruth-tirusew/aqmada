import Breadcrumb from "@/app/components/breadcrumb"
import { Page } from "@/app/types"
import {columns} from "./columns"
import getInvoices from "@/app/actions/getInvoices"
import { DataTable } from "@/components/ui/datatable"

const pages:Page[] = [
    {
        name:"Invoices",
        href:"/dashboard/invoices",
    },
]

export default async function Invoice() {
    const data = await getInvoices()

    return (
        <div className="">
            <Breadcrumb page={pages} heading="Invoice" subheading="Report of the total invoices saved"/>
            <DataTable
                columns={columns}
                data={[...data]}
                search={"customer_name"}
                button={true}
                buttonObj={{
                name: "Add Invoice",
                url: "/dashboard/invoices/create",
                }}
            />
        </div>
    )
}
