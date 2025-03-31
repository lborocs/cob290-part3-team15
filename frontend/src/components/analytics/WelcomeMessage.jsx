import React from 'react'

function WelcomeMessage({ userID, role }) {
  return (
    <div className="ml-0 col-span-4 col-start-2 row-span-1 row-start-2 rounded-4xl p-2">
      <h1 className="text-4xl font-bold text-start text-text">Welcome {userID}</h1>
      <h3 className='text-2xl text-start mt-0 '>{role}</h3>
    </div>
  )
}

export default WelcomeMessage