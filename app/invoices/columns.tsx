"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BookmarkCheck, Loader, LoaderCircle, PackageCheck, Receipt, Send } from "lucide-react"
import Link from "next/link"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Invoice = {
  id: string
  name: string
  status: "in progress" | "completed" | "sent" | "paid"
  date: string
}

export const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({row}) => {
        const status = row.getValue("status")
        if (status === "in progress") {
            return <div className="text-red-500 text-sm flex items-center space-x-2">
                <LoaderCircle />
                <p>In Progress</p>
            </div>
        } else if (status === "completed") {
            return <div className="text-yellow-500 text-sm flex items-center space-x-2">
                <BookmarkCheck />
                <p>Completed</p>
            </div>
        } else if (status === "sent") {
            return <div className="text-blue-500 text-sm flex items-center space-x-2">
                {/* <PackageCheck /> */}
                <Send />
                <p>Sent</p>
            </div>
        } else if (status === "paid") {
            return <div className="text-green-500 text-sm flex items-center space-x-2">
                <Receipt />
                <p>Paid</p>
            </div>
        }

        return <div>{row.getValue("status")}</div>
    }
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({row}) => {
        const name = String(row.getValue("name"));
        return <Link href='/'>
            <p>{name}</p>
        </Link>
    }
  },
  {
    accessorKey: "date",
    header: () => <div className="text-right">Date</div>,
    cell: ({row}) => {
        const date = String(row.getValue("date"));
        return <p className="text-right">{date}</p>
    }
  },
]
