import React from 'react'
import NavbarOwner from '../../Components/owner/NavbarOwner'
import Sidebar from '../../Components/owner/Sidebar'
import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className='flex flex-col '>
      <NavbarOwner />
      <div className="">
        <Sidebar />
        <Outlet/>
      </div>


    </div>
  )
}
