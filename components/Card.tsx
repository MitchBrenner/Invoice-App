import { useOrganization } from "@clerk/nextjs";
import Link from "next/link"

function Card({ name, icon, redirect }: {name: string, icon?: React.ReactNode, redirect: string}) {

    const { organization } = useOrganization();
    if (!organization) redirect = '/select-organization';

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
            <div>
                <p className="text-sm text-gray-400 text-end">5 completed invoices</p>
            </div>
        </div>
    </Link>
  )
}

export default Card