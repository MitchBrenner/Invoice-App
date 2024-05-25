import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='absolute top-0 flex w-full h-12 p-1 justify-between items-center px-3 bg-slate-200 border-b-2 border-slate-300'>
        <div>
            <Link href='/'>
                <p className='font-semibold'>Boardman Conveyor</p>
            </Link>
        </div>
        <div className='flex space-x-3 justify-center items-center'>
            {/* avatar */}
            <Link href='/select-organization '>
                <p className='text-xs hover:text-slate-500 transition-colors duration-300'>Organizations</p>
            </Link>
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
  )
}

export default Navbar

