export type Invoice = {
    id: string
    name: string
    status: "in progress" | "completed" | "sent" | "paid"
    timestamp: string
  }

