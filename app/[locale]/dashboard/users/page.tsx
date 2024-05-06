import Breadcrumb from "@/app/[locale]/components/breadcrumb";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./column";
import { Page } from "@/app/[locale]/types";
import { getUsers } from "@/app/actions/getUsers";
import { getDictionary } from "@/lib/locales";

// @ts-ignore
export default async function Users({params:{locale}
}) {
      const users = await getUsers()
      console.log(users)

      const dict = await getDictionary(locale)
      const pages: Page[] = [
        {
          name: dict.Users,
          href: `/${locale}/dashboard/users`,
        },
      ];

    return (
        <div className="h-screen">
        <Breadcrumb
            page={pages}
            heading= {dict.Users}
            subheading={dict.userSubheading}
          />
          <DataTable 
          columns={columns} data={[...users]} search="name" button={true}
          buttonObj={{
          name: dict.addUsers,
          url: `/${locale}/dashboard/users/create`,
          }}  />
        </div>
      );
    }
