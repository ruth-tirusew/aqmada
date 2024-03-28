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
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const saveWarehouse = async (name: string, location:string) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/warehouse/create", {
        name: name,
        location: location,
      });
      console.log(response)
        setLoading(false);

    } catch (error:any) {
      console.log(error);
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
          className="text-md w-full text-center px-8 py-4 md:px-6 md:py-3 dark:text-white text-black"
        >
            <span className="font-semibold text-xl mr-2">+</span>
            <p>Register Warehouse</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle className="tracking-wide dark:text-black">
          Register Warehouse
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            saveWarehouse(name, location);
          }}
        >
            <label
              htmlFor="name"
              className="dark:text-black mb-8 font-semibold"
            >
              Warehouse Name:
            </label>
            <Input
              type="text"
              id="name"
              name="name"
              placeholder="Warehouse Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3 placeholder:text-gray-200 mb-4"
              required
            />
            <label
              htmlFor="location"
              className="dark:text-black mb-8 font-semibold"
            >
              Warehouse Location:
            </label>
            <Input
              type="text"
              id="location"
              name="location"
              placeholder="Warehouse Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="col-span-3 placeholder:text-gray-200 mb-4"
              required
            />
        <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              className="bg-[#021044] hover:bg-[#021044]/90 flex w-full"
            >
              {
                loading ? (

                      <><PiSpinnerclassName="animate-spin mr-2" /><span>Loading...</span></>
                 
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
