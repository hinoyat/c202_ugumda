import React from 'react'

const Today = () => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${today.getMonth()+1}-${today.getDate()}`;
  return (
    <div className="text-[rgba(255,255,255,0.7)]">
        {formattedDate}
    </div>
  )
}

export default Today