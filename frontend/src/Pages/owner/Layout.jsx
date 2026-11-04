import React, { useEffect } from 'react'
import NavbarOwner from '../../Components/owner/NavbarOwner'
import Sidebar from '../../Components/owner/Sidebar'
import { Outlet } from 'react-router-dom'
import { useAppContext } from '../../Context/AppContext'
import OwnerSkeleton from '../../Components/owner/OwnerSkeleton'

export default function Layout() {
  const {isOwner, user, token, navigate }= useAppContext()

  useEffect(()=>{
    if(!token || (user && !isOwner))
        navigate('/')
  },[isOwner, user, token, navigate])
  if (token && !user) return <div className="mx-auto max-w-6xl px-6 py-12"><OwnerSkeleton variant="dashboard" label="Loading your owner account" /></div>
  if (!user || !isOwner) return null
  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner />
      <div className="flex flex-1">
        <Sidebar />
        <div className="min-w-0 flex-1"><Outlet /></div>
      </div>
    </div>
  )
}
