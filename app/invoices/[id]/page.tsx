import React from 'react'

function page( { params } : {params: {id: string}} ) {
  return (
    <div className='flex justify-center items-center w-full h-screen'>Invoice #{params.id}</div>
  )
}

export default page