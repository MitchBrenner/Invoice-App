import { db } from "@/firebase";
import { useOrganization } from "@clerk/nextjs";
import { collection, query, where } from "firebase/firestore";
import Link from "next/link"
import { useCollection } from "react-firebase-hooks/firestore";

function Card({ name, icon, redirect }: {name: string, icon?: React.ReactNode, redirect: string}) {

    const { organization } = useOrganization();
    if (!organization) redirect = '/select-organization';

    // retrieve the organization invoices from database
    const [docs, loading, error] = useCollection(
        organization && query(
            collection(db, `organizations/${organization.id}/invoices`),
            where("status", "==", "completed")
        )
    )

  return (
    <Link href={redirect}>
        <div 
            className='flex flex-col justify-between border border-slate-200 p-2 min-h-[200px] rounded-lg
            bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-100 transition-all duration-300 ease-in-out'
        >
            <div className="flex justify-start items-center space-x-2 m-5">
                <p className="text-2xl font-semibold">{name}</p>
                {icon}
            </div>
            {
                docs && (
                    <div className="flex justify-end items-center m-5 space-x-1">
                        <p className="text-md text-yellow-500 font-bold">{docs.docs.length} completed</p>
                        {/* <p className="text-md "> completed </p> */}
                    </div>
                )
            }
        </div>
    </Link>
  )
}

export default Card