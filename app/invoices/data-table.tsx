"use client"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BookmarkCheck, ChevronDown, LoaderCircle, Receipt, Send } from "lucide-react"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  // const [showStatusBar, setShowStatusBar] = useState<Checked>(true)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnFilters,
    },
  })

  return (
    <div className="rounded-md border">
      <div className="flex justify-center items-start py-4 space-x-5 px-5">
        <DropdownMenu>
          {/* button for dropdown */}
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              <div className="flex items-center">
                  {
                    table.getColumn("status")?.getFilterValue() === "In Progress" || 
                    table.getColumn("status")?.getFilterValue() === "Completed" || 
                    table.getColumn("status")?.getFilterValue() === "Sent" || 
                    table.getColumn("status")?.getFilterValue() === "Paid" 
                    ? table.getColumn("status")?.getFilterValue() as String : "All"
                  }
                  <ChevronDown size={21} className="ml-3"/>
              </div>
            </Button>
          </DropdownMenuTrigger>

          {/* dropdown menu content */}
          <DropdownMenuContent align="end">
            <DropdownMenuCheckboxItem
              checked={table.getColumn("status")?.getFilterValue() === null}
              onCheckedChange={() =>
                table.getColumn("status")?.setFilterValue(null)
              }
             >
              <div className="text-sm flex items-center space-x-2">
                <p>Show All</p>
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={table.getColumn("status")?.getFilterValue() as String === "In Progress"}
              onCheckedChange={() =>
                table.getColumn("status")?.setFilterValue("In Progress")
              }
            >
              <div className="text-red-500 text-sm flex items-center space-x-2">
                <LoaderCircle />
                <p>In Progress</p>
              </div>
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={table.getColumn("status")?.getFilterValue() as String === "Completed"}
              onCheckedChange={() =>
                table.getColumn("status")?.setFilterValue("Completed")
              }
            > 
              <div className="text-yellow-500 text-sm flex items-center space-x-2">
                <BookmarkCheck />
                <p>Completed</p>
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              
              checked={table.getColumn("status")?.getFilterValue() as String === "Sent"}
              onCheckedChange={() =>
                table.getColumn("status")?.setFilterValue("Sent")
              }
            >
              <div className="text-blue-500 text-sm flex items-center space-x-2">
                {/* <PackageCheck /> */}
                <Send />
                <p>Sent</p>
              </div>
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={table.getColumn("status")?.getFilterValue() as String === "Paid"}
              onCheckedChange={() =>
                table.getColumn("status")?.setFilterValue("Paid")
              }
            >
              <div className="text-green-500 text-sm flex items-center space-x-2">
                <Receipt />
                <p>Paid</p>
              </div>
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          placeholder="Search by name..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
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
                )
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-end space-x-4 py-4 pr-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
