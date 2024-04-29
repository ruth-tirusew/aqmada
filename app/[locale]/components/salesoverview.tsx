'use client'
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { CiShoppingBasket } from 'react-icons/ci';
import { ItemType } from '../types';

import {getDictionary} from "@/lib/locales";

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface InventoryItem {
  name: string;
  quantity: number;
}



interface SalesOverviewProps {
  items: ItemType[];
  names:{
    lowStockItems:string,
    totalItems:string,
    noItems:string
  }
}    

interface ChartData {
  labels: string[];
  series: number[];
}

const SalesOverview: React.FC<SalesOverviewProps> = ({ items, names }) => {
  const [loading, setLoading] = useState(true)

  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    series: [],
  });
  const [totalSales, setTotalSales] = useState<number>(0);
  const [restock, setRestock] = useState<InventoryItem[]>([]);

  useEffect(() => {
    
    const data = [...items].sort((a, b) => b.quantity - a.quantity);


    const labels: string[] = data.slice(0, 2).map((item) => item.name);
    if (data.length > 2) {
      labels.push('Others');
    }

    
    const values: number[] = data.slice(0, 2).map((item) => item.quantity);
    if (data.length > 2) {
      const otherValues: number = data.slice(2).reduce((sum, item) => sum + item.quantity, 0);
      values.push(otherValues);
    }

    setChartData({
      labels,
      series: values,
    });


    const total: number = data.reduce((sum, item) => sum + item.quantity, 0);
    setTotalSales(total);

 
    const itemsToRestock: InventoryItem[] = data.filter((item) => item.quantity < 3);
    setRestock(itemsToRestock);
  }, [items]);


  const options = {
    labels: chartData.labels,
    legend: {
      show: false
    },
    theme: {
      monochrome: {
        enabled: true,
        color: '#1C40CA',
        shadeTo: 'light' as "light",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
              },
              total: {
                show: true,
                label: 'Total',
                formatter: () => 'Total'
              }
            }
          }
        }
      }
    },
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

  return (
    <div className="bg-white shadow-md w-full rounded-md py-[9px] px-[12px] px-2 grid grid-cols-1 gap-2 divide-y divide-gray-300 dark:bg-black">
    {chartData.series.length === 0 || loading || totalSales === 0 ? (
          <div className="w-full h-full flex flex-col items-center justify-center mt-6 dark:text-white text-gray-400">
            <CiShoppingBasket size={100} className=" my-1.5" />
            <p className="font-semibold mb-10">
             {names.noItems}
            </p>
          </div>
        ) : (
      <div className="mt-1.5 mb-4">
        <Chart type="donut" height={200} width={200} options={options} series={chartData.series} />
      </div>
        )}
      <div className="flex flex-row justify-between w-full h-full mt-2">
        <div className="flex flex-col items-left gap-4 w-full">
          <p className="text-red-400 font-semibold text-sm mr-2 mb-4">{names.lowStockItems}</p>
          <p className="font-semibold text-sm mr-2">{names.totalItems}</p>
        </div>
        <div className="flex flex-col items-left gap-4 mb-2">
          <p className="text-red-400 font-semibold mb-4">{restock.length}</p>
          <p>{totalSales}</p>
        </div>
      </div>
    </div>
  );
};

export default SalesOverview;