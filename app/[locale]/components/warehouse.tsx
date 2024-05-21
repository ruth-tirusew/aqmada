import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useState } from "react";
import { PiSpinner } from "react-icons/pi";

const Warehouse = () => {
  const [loading, setLoading] = useState(false);
  const [warehouseName, setWarehouseName] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [error, setError] = useState("");

  const saveWarehouse = async (name: string, location:string) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/warehouse/create", {
        name: name,
        location: location,
      });
        setLoading(false);
        window.location.reload()

    } catch (error:any) {
      setLoading(false);
      setError(error.response.data.error);
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="text-md w-full text-center px-8 py-4 md:px-6 md:py-3 dark:text-white text-black dark:bg-gray-900 "
        >
            <span className="font-semibold text-xl mr-2">+</span>
            <p>Register Warehouse</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full dark:bg-gray-900">
        <DialogHeader>
          <DialogTitle className="tracking-wide dark:text-white">
          Register Warehouse
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveWarehouse(warehouseName, warehouseLocation);
          }}
        >
          <div className="">
          <label
              htmlFor="name"
              className="dark:text-white mb-8 font-semibold"
            >
              Warehouse Name:
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Warehouse Name"
              value={warehouseName}
              onChange={(e) => setWarehouseName(e.target.value)}
              className="col-span-3 placeholder:text-gray-200 mb-4 dark:bg-gray-900"
              required
            />

          </div>
          <div className="">
          <label
              htmlFor="location"
              className="dark:text-white mb-8 font-semibold"
            >
              Warehouse Location:
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              placeholder="Warehouse Location"
              value={warehouseLocation}
              onChange={(e) => setWarehouseLocation(e.target.value)}
              className="col-span-3 placeholder:text-gray-200 mb-4 dark:bg-gray-900"
              required
            />

          </div>
        <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              className="bg-[#021044] hover:bg-[#021044]/90 flex w-full"
            >
              {
                loading ? (

                      <><PiSpinner className="animate-spin mr-2" /><span>Loading...</span></>
                 
                ) : (
                  <>

                      <span>Register</span>
                  </>
                
                )
              }
              
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Warehouse;
