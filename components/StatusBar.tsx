import { LoaderCircle } from 'lucide-react';
import React from 'react'

interface StatusColors {
    [key: string]: string;
  }

function StatusBar({ status }: { status: string }) { // Define status as a property of props

    const statusColors: StatusColors = {
        "in progress": "text-red-500",
        "completed": "text-yellow-500",
        "sent": "text-blue-500",
        "paid": "text-green-500"
      };

    return (
        <div>
            <p className={`${statusColors[status]} text-sm`}>{status.toUpperCase()}</p>
            {
                status === 'in progress' ? (
                    <div className='w-full h-1 bg-red-500 rounded-full'></div>
                ) : status === 'completed' ? (
                    <div className='w-full h-1 bg-yellow-500 rounded-full'></div>
                ) : status === 'sent' ? (
                    <div className='w-full h-1 bg-blue-500 rounded-full'></div>
                ) : (
                    <div className='w-full h-1 bg-green-500 rounded-full'></div>
                )
            }
        </div>
    );
}

export default StatusBar;
