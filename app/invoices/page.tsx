'use client';
import { Button } from "@/components/ui/button"
import { Invoice } from "@/lib/types"
import { useEffect, useState } from "react"
import { useOrganization, useUser } from "@clerk/nextjs"
import { db } from "@/firebase"
import { addDoc, collection, doc, getDocs, orderBy, query, serverTimestamp, updateDoc } from "firebase/firestore"
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useCollection } from 'react-firebase-hooks/firestore';
import toast from "react-hot-toast";

// Fetch data from your API here.
// const data: Invoice[] = [
//   {
//     id: "1",
//     name: "Acme Corp",
//     status: "in progress",
//     date: "5/24/24"
//   },
//   {
//     id: "2",
//     name: "Widget Co",
//     status: "completed",
//     date: "5/3/24"
//   },
//   {
//     id: "3",
//     name: "Example Inc",
//     status: "sent",
//     date: "4/27/24"
//   },
//   {
//     id: "4",
//     name: "Sample LLC",
//     status: "paid",
//     date: "4/22/24"
//   },
// ]


function DemoPage() {
  // const data = await getData();
  const [addingInvoice, setAddingInvoice] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { organization } = useOrganization();
  const user = useUser();
  const router = useRouter();


  const [docs, loading, error] = useCollection(
    organization && query(
      collection(db, `organizations/${organization.id}/invoices`),
      orderBy("timestamp", "desc")
    )
  )

  useEffect(() => {
    if (!docs) return;

    const invoices = docs.docs.map(doc => doc.data() as Invoice);
    setInvoices(invoices);
    console.log(invoices);
    
  }, [docs]);


  const createInvoice = async () => {
    if (addingInvoice) return;
    if (!organization) return;
    setAddingInvoice(true);

    // add invoice to database add doc : organizations/organization.id/invoices/
    try {
      // Add invoice to database in the organizations collection
      const docRef = await addDoc(collection(db, `organizations/${organization.id}/invoices`), {
        id: "-1",
        userId: user?.user?.firstName + " " + user?.user?.lastName,
        timestamp: serverTimestamp(),
        status: "in progress",
        name: "Untitled Invoice",
      });

      await updateDoc(doc(db, `organizations/${organization.id}/invoices/${docRef.id}`), {
        id: docRef.id,
      });

      console.log(docRef.id);

      // Reroute to invoice page 
      router.push(`/invoices/${docRef.id}`);
      
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setAddingInvoice(false);
    }

  }

  return (
    <>
      <div className="container mx-auto py-20 space-y-3">
        <h1 className="font-black text-3xl text-slate-600">Invoices</h1>
        <Button 
          variant={"secondary"} 
          color="green"
          onClick={() => {
            toast.promise(createInvoice(), {
              loading: "Creating invoice...",
              success: "Invoice created!",
              error: "Failed to create invoice",
            })
          }}
          disabled={addingInvoice}
        >
          <p>New Invoice</p>
        </Button>
        <DataTable columns={columns} data={invoices} />
      </div>
    </>
  )
}

export default DemoPage;