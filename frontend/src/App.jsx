import React, { useState } from 'react'
import Navbar from './Components/Navbar'
import Home from "../src/Pages/Home"
import Cars from "../src/Pages/Cars"
import CarDetails from './Pages/CarDetails'
import MyBookings from './Pages/MyBookings'
import Layout from './Pages/Owner/Layout'
import Dashboard from './Pages/Owner/Dashboard'
import AddCar from './Pages/Owner/AddCar'
import ManageCars from './Pages/Owner/ManageCars'
import ManageBookings from './Pages/Owner/ManageBookings'

import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './Components/Footer'
import Login from './Components/Login'

export default function App() {


    const [showLogin , setShowLogin ] = useState(false)

    const isOwnerPath =  useLocation().pathname.startsWith('/owner')

  return (
    
    <>

   {
    showLogin &&  <Login setShowLogin={setShowLogin}/>
   }
    {!isOwnerPath &&  <Navbar setShowLogin={setShowLogin}/> }
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/car-details/:id' element={<CarDetails/>}/>
      <Route path='/cars' element={<Cars/>}/>
      <Route path='/my-bookings' element={<MyBookings/>}/>
      <Route path='/owner' element={<Layout />}> 
        <Route index element={<Dashboard/>}/>
        <Route path='add-car' element={<AddCar/>}/>
        <Route path='manage-cars' element={<ManageCars/>}/>
        <Route path='manage-bookings' element={<ManageBookings/>}/>

      </Route>
    </Routes>
  {!isOwnerPath &&  <Footer/> }

    </>
  )
}
