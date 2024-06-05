export type Invoice = {
    id: string
    userId: string
    invoiceNumber: number
    name: string
    status: "in progress" | "completed" | "sent" | "paid"
    timestamp: string
    downloadLink: string
  }

