import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { PiSpinner } from "react-icons/pi";

interface warehouseProps{
  isOpen: boolean
  handleClose: () => void;
}

export const WarehouseModal:React.FC<warehouseProps> = ({ isOpen, handleClose }) => {
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    if (warehouseName && warehouseLocation) {
      try {
        setLoading(true);
        const response = await axios.post("/api/warehouse/create", {
          name: warehouseName,
          location: warehouseLocation,
        });
        setLoading(false);
        window.location.reload();
      } catch (error:any) {
        setLoading(false);
        setError(error.response.data.error);
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } else {
      setError("Please fill out all fields");
    }
  };

  return (
    <div
      className={`
        justify-center 
        items-center 
        flex 
        overflow-x-hidden 
        overflow-y-auto 
        fixed 
        inset-0 
        z-50
        outline-none 
        focus:outline-none
        bg-neutral-800/70
      `}
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="relative w-full md:w-4/6 lg:w-3/6 xl:w-2/5 my-6 mx-auto lg:h-auto md:h-auto">
        <div
          className={`
            translate
            duration-300
            h-full
            border-0 
            rounded-lg 
            shadow-lg 
            relative 
            flex 
            flex-col 
            w-full 
            bg-white 
            dark:bg-black
            dark:text-white
            outline-none 
            focus:outline-none
            ${isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
          `}
        >
          <div className="flex items-center p-6 rounded-t justify-center relative border-b-[1px]">
            <button
              className="p-1 border-0 hover:opacity-70 transition absolute left-9"
              onClick={handleClose}
            >
              <IoMdClose size={18} />
            </button>
            <div className="text-lg font-semibold">Register Warehouse</div>
          </div>
          <div className="relative p-6 flex-auto">
          {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label htmlFor="name" className="dark:text-white font-semibold mb-2 block">
                Warehouse Name:
              </label>
              <Input
                type="text"
                id="name"
                name="name"
                placeholder="Warehouse Name"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                className="w-full placeholder:text-gray-200 dark:bg-black bg-transparent"
                required
              />
            </div> 
            <div className="">
              <label htmlFor="location" className="dark:text-white font-semibold mb-2 block">
                Warehouse Location:
              </label>
              <Input
                type="text"
                id="location"
                name="location"
                placeholder="Warehouse Location"
                value={warehouseLocation}
                onChange={(e) => setWarehouseLocation(e.target.value)}
                className="w-full placeholder:text-gray-200 bg-transparent"
                required
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 pb-6 px-6">
            <Button
              disabled={loading}
              type="submit"
              className="bg-[#021044] hover:bg-[#021044]/90 flex w-full"
              onClick={handleSubmit}
            >
              {loading ? (
                <>
                  <PiSpinner className="animate-spin mr-2" />
                  <span>Loading...</span>
                </>
              ) : (
                <span>Register</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};