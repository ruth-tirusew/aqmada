import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface Props{
    heading:string
    icon: IconType
    link:string,
}

export const NavLink:React.FC<Props> = ({heading, icon: Icon, link}) => {
    const router = usePathname();
    const locale = router?.split("/")[1];

    const isActive = (href: string) => {
      if (router) {
      const path = router.split("/");
      if ((router==="/en/dashboard"||router==="/am/dashboard") && href===("")) { 
        return true;
      }

        if (path[3]==(href)) {
          return true;
        }
      }
    };


    return (
        <Link
        href={{
          pathname: `/${locale}/dashboard/${link}`,
        }}
        passHref
        className={`flex items-center group pl-8 py-3 ${
          isActive(link)
            ? "border-[#1C40CA] border-r-4 bg-[#1C40CA]/[0.1]"
            : "group-hover:border-r-4 hover:border-[#1C40CA]/[0.5] hover:bg-[#1C40CA]/[0.1] dark:hover:bg-[#1C40CA]/[10%] active:border-[#1C40CA] hover:border-r-2 active:border-r-2"
        } text-md`}
      >
        <Icon
          className={`group-hover:text-[#1C40CA] group-active:text-[#1C40CA] mr-2 text-xl sm:text-md ${
            isActive(link) ? "text-[#1C40CA]" : ""
          }`}
        />
        <span
          className={`group-hover:text-black font-semibold text-sm dark:group-hover:text-white hidden sm:block ${
            isActive(link)
              ? "text-black dark:text-white"
              : "text-gray-500"
          }`}
        >
          {heading}
        </span>
      </Link>
    )
}