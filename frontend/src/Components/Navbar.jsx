import React from 'react'
import {assets, menuLinks} from "../assets/assets"
import {Link} from "react-router-dom"

export default function Navbar() {
  return (
    <div>
      
      <Link to='/'>
         <img src={assets.logo} alt="logo"  className='h-8' />    
      </Link>
      <div className="max-sm:fixed max-sm:h-screen max-sm:w-full  max-sm:top-16 max-sm:border-t border-borderColor right-0 flex  
      flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 max-sm:p-4 transition-all duration-300 z-50">

        {
          menuLinks.map((link,index)=>(
            <Link key={index} to={link.path}>
             {link.name}
            </Link>
          ))
        }
      </div>



    </div>
  )
}
