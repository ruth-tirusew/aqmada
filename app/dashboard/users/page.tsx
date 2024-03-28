import Breadcrumb from "@/app/components/breadcrumb";
import { DataTable } from "@/components/ui/datatable";
import { columns } from "./column";
import { Page } from "@/app/types";
import { getUsers } from "@/app/actions/getUsers";

export default async function Users() {
    const pages: Page[] = [
        {
          name: "Users",
          href: "/dashboard/users",
        },
      ];
      const users = await getUsers()

    return (
        <div className="">
        <Breadcrumb
            page={pages}
            heading="Users"
            subheading="List of all users registered under your company"
          />
          <DataTable 
          columns={columns} data={users} search="name" button={true}
          buttonObj={{
          name: "Add User",
          url: "/dashboard/users/create",
          }}  />
        </div>
      );
    }
