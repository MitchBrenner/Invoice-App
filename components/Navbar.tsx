import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

function Navbar() {
  return (
    <div className='flex w-full h-12 p-1 justify-between items-center px-3 bg-slate-200 border-b-2 border-slate-300'>
        <div>
            <Link href='/'>
                <p className='font-semibold'>Boardman Conveyor</p>
            </Link>
        </div>
        <div>
            {/* avatar */}
            <SignedIn>
                <UserButton />
            </SignedIn>
        </div>
    </div>
  )
}

export default Navbar

