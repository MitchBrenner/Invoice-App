"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BookmarkCheck, Loader, LoaderCircle, PackageCheck, Receipt, Send } from "lucide-react"
import Link from "next/link"
import { Invoice } from "@/lib/types"
import { Timestamp } from "firebase/firestore"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.


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
        const name = row.getValue("name") === undefined ? "Untitled Invoice" : String(row.getValue("name"));
        // const name  = String(row.getValue("name"));
        const id = String(row.getValue("id"));
        return <Link href={`/invoices/${id}`}>
            <p>{name}</p>
        </Link>
    }
  },
  {
    accessorKey: "id",
    header: () => <div className="text-right">ID</div>,
    cell: ({row}) => {
        const id = String(row.getValue("id"));
        return <p className="text-right">#{id}</p>
    }
  },
  {
    accessorKey: "timestamp",
    header: () => <div className="text-right">Date</div>,
    cell: ({row}) => {
        const timestamp: Timestamp = row.getValue("timestamp");
        const date = new Date(timestamp.seconds * 1000).toLocaleDateString();



        return <p className="text-right">{date}</p>
    }
  },
]
