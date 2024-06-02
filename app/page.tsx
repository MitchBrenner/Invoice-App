'use client';
import { auth, currentUser } from "@clerk/nextjs/server"
import Card from "@/components/Card";
import { useUser, useOrganization, OrganizationList } from "@clerk/clerk-react";
import { FileBarChart2, FileIcon, Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


const cards = [
  {
    name: 'Invoices',
    icon: <FileBarChart2 />,
    redirect: '/invoices'
  },
  // {
  //   name: 'W2',
  //   icon: <FileIcon />,
  //   redirect: '/w2'
  // }
]

export default function Home() {

  // const user = await currentUser();
  const user = useUser();
  // const {userId} = auth();
  const { organization } = useOrganization()
  
  return (
    <main className="relative top-[60px] p-5 ">
      <div className="space-y-5 mb-10 mt-5">
        <div className="flex justify-center items-end">
          <h1 className="text-5xl font-bold text-center">
            {organization ? organization.name : "Personal"} Dashboard
          </h1>
          {
            organization ? (
              <Button variant={'ghost'}>
                <Link href={`/organization-profile/${organization.slug}`}>
                  <Pencil size={18} />
                </Link>
              </Button>
            ) : 
            (<></>)
          }
        </div>
        <hr />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {cards.map((card, index) => (
          <Card key={index} name={card.name} icon={card.icon} redirect={card.redirect}/>
        ))}
      </div>
      {/* <div>
        <p>{user?.user?.id}</p>
        <p>{organization?.id}</p>
        <p>{organization?.slug}</p>
      </div> */}
    </main>
  );
}

