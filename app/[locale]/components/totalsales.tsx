"use client";
import React, { useEffect, useState, useCallback } from "react";
import dynamic from "next/dynamic";

import axios from "axios";

import { InvoiceItemsType, InvoiceType } from "../types";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const TotalSales: React.FC<{ name: string, invoice:InvoiceType[] }> = ({ name, invoice })  => {
  const [months, setMonths] = useState<string[]>([]);
  const [seriesData, setSeriesData] = useState<number[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);

  const fetchInvoices: any = useCallback(async () => {
    try {
      invoice.map((i: any) => {});

      const invoiceMonths = invoice.map((invoice: any) => {
        const date = new Date(invoice.created_at);
        return date.toLocaleString("default", { month: "short" });
      });

      const monthCounts: { [month: string]: number } = {};
      invoiceMonths.forEach((month: string) => {
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });

      const sortedMonths = Object.keys(monthCounts).sort((a, b) => {
        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
      });

      setMonths(sortedMonths);

      const seriesData: number[] = [];
      sortedMonths.forEach((month: string) => {
        const total = invoice
          .map((invoice: { created_at: any; items: any[]; }) => {
            const date = invoice.created_at;
            return "Jan" === month
              ? invoice.items?.reduce(
                  (acc: number, item: any) =>
                    acc + item.selling_price * item.quantity,
                  0
                )
              : 0;
          })
          .reduce((acc: number, invoice: any) => acc + invoice, 0);
        seriesData.push(total);
      });
      setSeriesData(seriesData);

      const total = invoice.reduce((acc: number, invoice: any) => {
        const salequantity = invoice.items.reduce(
          (inventoryAcc: number, item: any) => {
            const sellingPrice = item.selling_price;
            const quantity = item.quantity;
            return inventoryAcc + sellingPrice * quantity;
          },
          0
        );
        return acc + salequantity;
      }, 0);
      setTotalSales(total);
    } catch (error:any) {
      console.error("Error fetching invoices:", error);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const options = {
    chart: {
      id: "area",
    },
    xaxis: {
      categories: months,
    },
    colors: ["#00A0EA"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth" as "smooth",
    },
    responsive: [
      {
        breakpoint: 1100,
        options: {
          chart: {
            width: 300,
            height: 200,
          },
          legend: {
            position: "bottom" as "bottom",
          },
        },
      },
    ],
    noData: {
      text: 'No Data Available',
      align: 'center' as "center",
      verticalAlign: 'middle' as "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: "black",
        fontSize: '14px',
      }
    },
  };

  const series = [
    {
      name: "Sales",
      data: seriesData,
    },
  ];

  return (
    <div className="bg-white shadow-md sm:p-2 w-full  rounded-md px-4 dark:bg-black">
      <div className="flex justify-between">
        <div className="p-2">
          <p className="font-semibold text-lg">
            ${totalSales.toLocaleString()}
          </p>
          <p className="font- text-md mr-2">{name}</p>
          <span></span>
        </div>
      </div>
      <Chart
        type="area"
        width={1100}
        height={225}
        options={options}
        series={series}
        className="dark:text-white h-full"
      />
      {/* <button className="w-full text-center border-[#00A0EA] border-2 text-[#00A0EA] mt-4 p-[2px] rounded-sm font-medium">
        Details
      </button> */}
    </div>
  );
};

export default TotalSales;
