import React from 'react'

const Title = ( {text1, text2}) => {
  return (
    <div className='flex items-center gap-2'> 
      <h1 className='font-medium text-2xl'>{text1}</h1>  
      <span className="underline text-primary">
        <h2 className='inline'>{text2}</h2>
      </span>
    </div>
  )
}

export default Title