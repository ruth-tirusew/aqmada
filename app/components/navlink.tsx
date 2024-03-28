import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IconType } from "react-icons";

interface Props{
    heading:string
    icon: IconType
    link:string
}

export const NavLink:React.FC<Props> = ({heading, icon: Icon, link}) => {
    const router = usePathname();
    const isActive = (href: string) => {
      if (router) {
      const path = router.split("/");
      if (router==="/dashboard" && href===("")) { 
        return true;
      }

        if (path[2]==(href)) {
          return true;
        }
      }

      //   console.log(path, "path")
      //   console.log(href, "href")
      //   return path.startsWith(href);
      // }
    };


    return (
        <Link
        href={{
          pathname: `/dashboard/${link}`,
        }}
        passHref
        className={`flex items-center group pl-8 py-3 ${
          isActive(link)
            ? "border-[#1C40CA] border-r-4 bg-[#1C40CA]/[0.1]"
            : "hover:border-r-4 hover:border-[#1C40CA]/[0.5] hover:bg-[#1C40CA]/[0.1] dark:hover:bg-[#1C40CA]/[10%] active:border-[#1C40CA] hover:border-r-2 active:border-r-2"
        } text-md`}
      >
        <Icon
          className={`group-hover:text-[#1C40CA] group-active:text-[#1C40CA] sm:mr-2 text-xl sm:text-md ${
            isActive(link) ? "text-[#1C40CA]" : ""
          }`}
        />
        <span
          className={`group-hover:text-black font-semibold text-sm hidden sm:block ${
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