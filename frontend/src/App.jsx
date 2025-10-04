import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import { useLocation } from 'react-router-dom'

export default function App() {


    const [showLogin , setShowLogin ] = useState(false)

    const isOwnerPath =  useLocation().pathname.startsWith('/owner')

  return (
    <>
    {!isOwnerPath &&  <Navbar setShowLogin={setShowLogin}/> }

    </>
  )
}
