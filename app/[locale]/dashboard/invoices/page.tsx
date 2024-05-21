import Breadcrumb from "@/app/[locale]/components/breadcrumb"
import { InvoiceType, Page } from "@/app/[locale]/types"
import { columns } from "./columns"
import getInvoices from "@/app/actions/getInvoices"
import { DataTable } from "@/components/ui/datatable"
import { getDictionary } from "@/lib/locales"
import { useEffect } from "react"

// @ts-ignore
export default async function Invoice({ params: { locale } }) {
    
    const data =  await getInvoices();
    let error;
    
    const dict = await getDictionary(locale);
    const pages: Page[] = [
        {
            name: dict.Invoices,
            href: "/dashboard/invoices",
        },
    ];

    return (
        <div className="h-screen">
            <Breadcrumb page={pages} heading={dict.Invoices} subheading={dict.invoiceSubheading} />
            <DataTable
                columns={columns}
                data={[...data]}
                search={"customer_name"}
                button={true}
                buttonObj={{
                    name: dict?.addInvoices,
                    url: `/${locale}/dashboard/invoices/create`,
                }}
            />
        </div>
    );
}