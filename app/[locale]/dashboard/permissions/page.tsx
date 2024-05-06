import Breadcrumb from "@/app/[locale]/components/breadcrumb"
import { InvoiceType, Page } from "@/app/[locale]/types"
import { columns } from "./columns"
import getPermissions from "@/app/actions/getPermissions"
import { DataTable } from "@/components/ui/datatable"
import { getDictionary } from "@/lib/locales"

// @ts-ignore
export default async function Invoice({ params: { locale } }) {
    let data: any[] = [];
    let error;
    
    try {
        data = await getPermissions();
    } catch (err) {
        error = "Uh! Oh Something went wrong";
    }
    
    
    const dict = await getDictionary(locale);
    const pages: Page[] = [
        {
            name: dict["role-min"],
            href: `${locale}/dashboard/permissions`,
        },
    ];

    return (
        <div className="h-screen">
            <Breadcrumb page={pages} heading={dict.Role} subheading={dict.permissionSubHeading} />
            <DataTable
                columns={columns}
                data={[...data]}
                search={"name"}
                searchPlaceholder={dict.Search}
                button={true}
                buttonObj={{
                    name: dict?.addPermission,
                    url: `/${locale}/dashboard/permissions/create`,
                }}
            />
        </div>
    );
}