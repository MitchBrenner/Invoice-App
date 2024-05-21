import React from 'react'

function Card({ name, num, icon }: {name: string, num?: number, icon?: React.ReactNode}) {
  return (
    <div className=''>
        {name}
    </div>
  )
}

export default Card