'use client';
import { auth, currentUser } from "@clerk/nextjs/server"
import Card from "@/components/Card";
import { useUser, useOrganization, OrganizationList } from "@clerk/clerk-react";
import { FileBarChart2, FileIcon } from "lucide-react";
import { useState } from "react";


const cards = [
  {
    name: 'Invoices',
    icon: <FileBarChart2 />,
    redirect: '/invoices'
  },
  {
    name: 'W2',
    icon: <FileIcon />,
    redirect: '/w2'
  }
]

export default function Home() {

  // const user = await currentUser();
  const user = useUser();
  // const {userId} = auth();
  const { organization } = useOrganization()
  
  return (
    <main className="relative top-[60px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {cards.map((card, index) => (
            <Card key={index} name={card.name} icon={card.icon} redirect={card.redirect}/>
          ))}
        </div>
        <div>
          <p>{user?.user?.id}</p>
          <p>{organization?.id}</p>
          <p>{organization?.slug}</p>
        </div>
    </main>
  );
}

