"use client";
import * as React from "react";

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button";
import { IoCloudUploadOutline } from "react-icons/io5";
import axios from "axios";

import { createClient } from '@supabase/supabase-js'

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CiFilter } from "react-icons/ci";
import Link from "next/link";
import { constants } from "buffer";
import { PiSpinner } from "react-icons/pi";

interface buttonObj {
  name: string;
  url: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  button?: boolean;
  heading?: string;
  subheading?: string;
  search?: string;
  buttonObj?: buttonObj;
  title?: string;
  searchPlaceholder?: string;
  upload?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  button,
  heading,
  subheading,
  search,
  buttonObj,
  title,
  searchPlaceholder,
  upload,
}: DataTableProps<TData, TValue>) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });




  const supabase = createClient('https://npihykocnhmtnsbqxhzm.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5waWh5a29jbmhtdG5zYnF4aHptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzMzcwOTksImV4cCI6MjAyMzkxMzA5OX0._gFWwX4c1YCoQkRrd0gzSwQTfrJVy1cTIVsH9IKHDFU')
  const { toast } = useToast()
  // const demo = () =>{
  //   toast({
  //     variant: "destructive",
  //     title: "Uh oh! Something went wrong.",
  //     description: "There was a problem with your request.",
  //   })
  // }
  const [loading, setLoading] = React.useState(false)

  const onUpload = async(e:any) =>{
    setLoading(true)
    const file = e.target.files[0]
    if (!file) return
    const { data, error } = await supabase.storage
      .from('aqmada-files').upload(`file_${Date.now()}`, file)
    
      if(data){
        try{
        const fileUrl = `https://npihykocnhmtnsbqxhzm.supabase.co/aqmada-files/${data.path}`
       const response =  await axios.put('/api/uploadfile', {"file":fileUrl})
       
       if(response.status==200){
        toast({
          description: "Data uploaded successfully",
          className:
            'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4 bg-emerald-900 text-white'
          ,
          variant: 'default',
        })
       }
        }catch(error){
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
          })
        }finally{
          setLoading(false)
        }
      }
    
  }

  return (
    <div className="w-full bg-white dark:bg-black p-4 rounded-md mt-4">
      {button && buttonObj?.name && (
        <div className="sm:flex customers-center py-4 gap-2 items-center">
          <div className="flex gap-2">
          <Link href={buttonObj.url} passHref>
            <Button
              variant="outline"
              size="sm"
              className="border-[#1C40CA] bg-slate-100 dark:bg-black hover:text-[#1C40CA] text-[#1C40CA] px-6 sm:mb-0 mb-2"
            >
              + {buttonObj.name}
            </Button>
          </Link>
          <div>
            {upload && (
              <label htmlFor="file-upload">
                {!loading ? (
                    <>
                                    <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={onUpload}
                />
                 <div
              className="border border-[#1C40CA] rounded-md flex items-center gap-4 cursor-pointer bg-slate-100 dark:bg-black hover:text-[#1C40CA] text-[#1C40CA] px-6 py-[5px] sm:mb-0 mb-2">
                  
                  <p>Upload Data</p>
                  </div>
                  </>
                  ) : (
                    <Button
                    disabled
                    type="submit"
                    className="border border-[#1C40CA] rounded-md flex items-center gap-4  bg-slate-100 dark:bg-black hover:text-[#1C40CA] text-[#1C40CA] px-6 py-1.5 sm:mb-0 mb-2"
                  >
                      <>
                        <PiSpinner className="animate-spin mr-2" />
                        <span>Loading</span>
                      </>
                      </Button>
                  )
                }
              </label>
            )}
          </div>

          </div>
          <div className="flex ml-auto items-center">
            <Input
              placeholder={searchPlaceholder}
              value={
                (table.getColumn(`${search}`)?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn(`${search}`)?.setFilterValue(event.target.value)
              }
              className="max-w-sm bg-transparent"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="ml-auto focus:outline-none ring-none">
                  <CiFilter className="ml-2 h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      )}
      {!button && title && (
        <p className="font-semibold text-md my-4">{title}</p>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-transparent hover:bg-transparent">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="bg-transparent hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No data available.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="bg-transparent font-medium"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="bg-transparent font-medium"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
