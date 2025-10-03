import React from 'react'
import {assets} from "../assets/assets"
import {Link} from "react-router-dom"

export default function Navbar() {
  return (
    <div>
      
      <Link to='/'>
         <img src={assets.logo} alt="logo"  className='h-8' />    
      </Link>



    </div>
  )
}
