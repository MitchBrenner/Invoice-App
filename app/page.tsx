import Card from "@/components/Card";
import { FileBarChart2, FileIcon } from "lucide-react";
import { redirect } from "next/dist/server/api-utils";


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
  return (
    <main className="">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
        {cards.map((card, index) => (
          <Card key={index} name={card.name} icon={card.icon} redirect={card.redirect}/>
        ))}
      </div>
    </main>
  );
}

