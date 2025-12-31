import React, { useEffect } from 'react'
import NavbarOwner from '../../Components/owner/NavbarOwner'
import Sidebar from '../../Components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../Context/AppContext'

export default function Layout() {
  const {isOwner , navigate }= useAppContext()

  useEffect(()=>{
    if(!isOwner) 
        navigate('/')
  },[isOwner])
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner />
      <div className="flex flex-1">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  )
}