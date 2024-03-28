"use client";
import React, { useEffect, useState } from "react";
import { CiShoppingBasket } from "react-icons/ci";
import Image from "next/image";
import { InvoiceType, InvoiceItemsType, ItemType } from "../types";
interface Props {
  invoices: InvoiceItemsType[];
}

const TopSelling: React.FC<Props> = ({ invoices }) => {
  const [topSellingItems, setTopSellingItems] = useState<any[]>([]);

  const topSelling = () => {
    let top: ItemType[] = [];
    invoices.forEach((invoice) => {
      invoice.items?.forEach((item) => top.push(item));
    });
    let topSelling = top.sort((a, b) => b.quantity - a.quantity).slice(0, 3);
    setTopSellingItems(topSelling);
  };
  
  useEffect(() => {
    topSelling();
  });

  return (
    <div className="bg-white shadow-md w-full h-full rounded-md p-4">
      <div>
        <p className="font-semibold text-md mb-2">Top Selling</p>
      </div>
      <div className="flex justify-center">
        {topSellingItems.length === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center mb-4">
            <CiShoppingBasket size={100} className="text-gray-400 my-1.5" />
            <p className="text-gray-600 font-semibold">
              You haven&apos;t sold anything yet
            </p>
          </div>
        ) : (
          <div className="flex w-full  h-full divide-x divide-gray-300 flex-wrap gap-6 items-center justify-center">
            {topSellingItems.map((item, index) => (
              <div
                className="flex flex-col items-center justify-center"
                key={index}
              >
                {item.image ? (
                  <Image
                    src={item.Inventory.image}
                    alt={item.Inventory.name}
                    width={100}
                    height={100}
                  />
                ) : (
                  <CiShoppingBasket size={85} className="text-gray-700" />
                )}
                <div className="flex gap-2 mb-6 mx-6">
                  <p className="text-center">{item.Inventory.name}:</p>
                  <p className="text-center font-semibold">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopSelling;
