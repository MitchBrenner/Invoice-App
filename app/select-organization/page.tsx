import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='flex w-full h-screen justify-center items-center flex-col space-y-3'>
      <div className='text-center'>
        <p className='text-red-500 font-semibold'>MUST BE IN AN ORGANIZATION TO VIEW INVOICES</p>
        <p className='text-red-500 text-sm'>Cannot be your personal account!</p>
      </div>
        <OrganizationList
            afterCreateOrganizationUrl='/'
            afterSelectPersonalUrl='/'
            afterSelectOrganizationUrl='/'
        />
    </div>
  )
}

export default page