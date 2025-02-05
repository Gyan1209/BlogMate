import React from 'react'

function Logo({ 
  width = "100px",
  className = ""
}) {
  return (
    <div className={`cursor-pointer font-bold text-2xl italic duration-200 ${className}`}>
    BlogMate
    </div>
  )
}

export default Logo