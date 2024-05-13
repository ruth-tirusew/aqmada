'use client'
import useNetworkStatus from "@/app/lib/hooks/network";
import React from "react";

import { MdOutlineSignalCellularConnectedNoInternet0Bar } from "react-icons/md";
import { MdNetworkCell } from "react-icons/md";

const Network = () =>{
    const { isOnline, isVisible } = useNetworkStatus()
    return(
        <div className={`w-screen flex justify-center ${!isOnline ? "block" :"hidden"} p-2 bg-slate-700 text-white font-semibold`}>
            <p className="flex justify-between items-center gap-4">
                <MdOutlineSignalCellularConnectedNoInternet0Bar className="text-red-500"/> Please check your internet connection
            </p>
        </div>
    )
}

export default Network