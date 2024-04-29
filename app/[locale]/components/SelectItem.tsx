'use client'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { useEffect, useState } from "react";
import { ItemType } from "../types";
import { useRouter } from "next/navigation";
import {  InvoiceItemForm } from "@/app/[locale]/types";

interface SelectItemsProps {
  onChange: (value: string) => void;
  value: string | InvoiceItemForm;
}

const SelectItems: React.FC<SelectItemsProps> = ({ onChange, value }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ItemType[]>([]);


  const fetchItems = async () => {
    try {
      const response = await axios.get("/api/inventory")
      setItems(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);


  const handleSelectChange = (selectedValue: string) => {
    onChange(selectedValue);
  };

  return (
    <Select
      onValueChange={(value) => handleSelectChange(value)}
    >
      <SelectTrigger className="w-full bg-transparent">
        <SelectValue placeholder="Select item" />
      </SelectTrigger>
      {loading ? (
        <SelectContent>Loading...</SelectContent>
      ) : items.length === 0 ? (
        <SelectContent>No items found</SelectContent>
      ) : (
        <SelectContent className="dark:bg-gray-900 dark:text-white">
          {items.map((group) => (
            <SelectGroup key={group.id}>
              <SelectItem
                value={group.id}
                onSelect={() => handleSelectChange(group.id)}
              >
                {group.name}
              </SelectItem>
            </SelectGroup>
          ))}
          <hr />
          <button
            className="flex justify-center space-x-4 py-2 items-center w-full"
            onClick={() => {
              router.push("/dashboard/inventory/create");
            }}
          >
            <span className="font-semibold text-[#1C40CA] text-xl">+</span>
            <p>Register Item</p>
          </button>
        </SelectContent>
      )}
    </Select>
  );
};

export default SelectItems;