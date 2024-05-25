import { OrganizationList } from '@clerk/nextjs'
import React from 'react'

function page() {
  return (
    <div className='flex w-full h-screen justify-center items-center'>
        <OrganizationList
            afterCreateOrganizationUrl='/'
            afterSelectPersonalUrl='/'
            afterSelectOrganizationUrl='/'
        />
    </div>
  )
}

export default page