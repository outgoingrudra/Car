import React, { useState } from 'react'
import {assets, menuLinks} from "../assets/assets"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useAppContext} from "../Context/AppContext"
import toast from 'react-hot-toast'

export default function Navbar() {
  const {setShowLogin,user,logout , isOwner , setIsOwner , axios } = useAppContext()

  const location =  useLocation()
  const [open,setOpen] =  useState(false)

  const navigate =  useNavigate()
  const changeRole = async()=>{
    try {
    const {data} =  await axios.post("/api/owner/change-role")
    if(data.success)
    {
      setIsOwner(true)
      toast.success(data.message)
    }
    else{
      toast.error(data.message)
      console.log("error in Navbar file");
      
    }
    } catch (error) {
      toast.error(error.message)
      console.log("error in Navbar file");
      
    }
  }

  return (
    <div className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all
          ${location.pathname=="/" && "bg-light" } 
       
    `}>
      
      <Link to='/'>
         <img src={assets.logo} alt="logo" className='h-8' />    
      </Link>
      <div className={`max-sm:fixed max-sm:h-screen max-sm:w-full max-sm:top-16 max-sm:left-0 max-sm:border-t border-borderColor flex  
      flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-6 transition-all duration-300 z-50 ${location.pathname=="/" ? "bg-light" : "bg-white"} ${
        open ? "max-sm:translate-x-0" : "max-sm:translate-x-full"
        
      }`}>

        {
          menuLinks.map((link,index)=>(
            <Link key={index} to={link.path} className="w-full sm:w-auto">
             {link.name}
            </Link>
          ))
        }


        <div className="hidden lg:flex items-center text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
          <input type="text" className='py-1.5 w-full bg-transparent outline-none placeholder-gray-500' placeholder='Search prodcuts' />
          <img src={assets.search_icon} alt="search" className='h-5 cursor-pointer' />
          
        </div>
       

       <div className="flex w-full sm:w-auto max-sm:flex-col items-start sm:items-center gap-4 sm:gap-6">
        <button onClick={()=>{isOwner ? navigate("/owner") : changeRole}} className='cursor-pointer w-full sm:w-auto text-left sm:text-center'>{isOwner ? "Dashboard" : "List Cars"}</button>
        <button onClick={()=>{user ? logout() : setShowLogin(true)}} className='cursor-pointer px-8 py-2 w-full sm:w-auto bg-blue-700 hover:bg-blue-500 transition-all text-white rounded-lg'>{user ? "Log Out":"Log In"}</button>
       </div>

      </div>

      <button className='sm:hidden cursor-pointer flex items-center justify-center' aria-label='Menu' onClick={()=>setOpen(!open)
      }>
           
           <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" />

      </button>



    </div>
  )
}