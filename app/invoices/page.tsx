import { Button } from "@/components/ui/button"
import { Invoice, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Invoice[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Acme Corp",
      status: "in progress",
      date: "5/24/24"
    },
    {
      id: "728ed52g",
      name: "Widget Co",
      status: "completed",
      date: "5/3/24"
    },
    {
      id: "728ed52h",
      name: "Example Inc",
      status: "sent",
      date: "4/27/24"
    },
    {
      id: "728ed52i",
      name: "Sample LLC",
      status: "paid",
      date: "4/22/24"
    },
  ]
}

export default async function DemoPage() {
  const data = await getData()

  return (
    <>
      <div className="container mx-auto py-20 space-y-3">
        <h1 className="font-black text-3xl text-slate-600">Invoices</h1>
        <Button variant={"outline"} color="green">
          <p>New Invoice</p>
        </Button>
        <DataTable columns={columns} data={data} />
      </div>
    </>
  )
}
