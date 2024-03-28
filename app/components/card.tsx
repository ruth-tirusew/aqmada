import React from "react";
import { IconType } from "react-icons";

interface Props {
  heading: string;
  subheading: string;
  badges: string;
  icon: IconType;
}

export const Card: React.FC<Props> = ({
  heading,
  subheading,
  badges,
  icon: Icon,
}) => {
  return (
    <div className="relative group isolate rounded-xl bg-white dark:bg-black hover:bg-opacity-90 dark:hover:bg-opacity-90 transition-[10%] ring-1 ring-gray-200 dark:ring-gray-800 before:hidden before:lg:block before:absolute before:-inset-[2px] before:h-[calc(100%+4px)] before:w-[calc(100%+4px)] before:z-[-1] before:rounded-[13px] flex-1 flex flex-col shadow hover:ring-[#00A0EA] dark:hover:ring-[#00A0EA] transition-shadow duration-200 p-8">
      <div className="flex justify-between items-center">
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <Icon size={26} />
            <p className="text-gray-900 dark:text-white text-base font-bold truncate">
              {heading}
            </p>
          </div>
          <p className="text-mds text-gray-500 dark:text-gray-400 mt-1">
            {subheading}
          </p>
        </div>
        <div className="absolute top-2 right-2 mt-1 mr-1 bg-[#00A0EA]/[10%] text-[#00A0EA] font-medium border border-[#00A0EA] text-xs rounded-lg px-2 py-1">
          <p className="dark:text-white ">{badges}</p>
        </div>
      </div>
    </div>
  );
};
