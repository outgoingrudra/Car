import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import Home from "../src/Pages/Home"
import { Route, Routes, useLocation } from 'react-router-dom'

export default function App() {


    const [showLogin , setShowLogin ] = useState(false)

    const isOwnerPath =  useLocation().pathname.startsWith('/owner')

  return (
    <>
    {!isOwnerPath &&  <Navbar setShowLogin={setShowLogin}/> }
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/car-details/:id' element={<CarDetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
    </Routes>

    </>
  )
}
