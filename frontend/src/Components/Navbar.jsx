import React, { useState } from 'react'
import {assets, menuLinks} from "../assets/assets"
import {Link, useLocation, useNavigate} from "react-router-dom"
import {useAppContext} from "../Context/AppContext"
import toast from 'react-hot-toast'
import {motion, AnimatePresence}  from "framer-motion"

export default function Navbar() {
  const {setShowLogin, user, logout, isOwner, setIsOwner, axios} = useAppContext()

  const location = useLocation()
  const [open, setOpen] = useState(false)

  const navigate = useNavigate()
  
  const changeRole = async()=>{
    try {
      const {data} = await axios.post("/api/owner/change-role", user)
      if(data.success) {
        setIsOwner(true)
        toast.success(data.message)
        setOpen(false) // Close menu after action
      } else {
        toast.error(data.message)
        console.log("error in Navbar file");
      }
    } catch (error) {
      toast.error(error.message)
      console.log("error in Navbar file");
    }
  }

  const handleDashboardClick = () => {
    if(isOwner) {
      navigate("/owner")
    } else {
      changeRole()
    }
    setOpen(false) // Close menu
  }

  const handleAuthClick = () => {
    if(user) {
      logout()
    } else {
      setShowLogin(true)
    }
    setOpen(false) // Close menu
  }

  // Close menu when clicking a link
  const handleLinkClick = () => {
    setOpen(false)
  }

  // Mobile menu animation variants
  const menuVariants = {
    hidden: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    visible: {
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  }

  const linkVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.3
      }
    })
  }

  return (
    <>
      <motion.div 
        initial={{y: -20, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        transition={{duration: 0.5}}
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all
          ${location.pathname === "/" && "bg-light"} 
        `}
      >
        
        <Link to='/' onClick={handleLinkClick}>
          <motion.img 
            whileHover={{scale: 1.05}} 
            src={assets.logo} 
            alt="logo" 
            className='h-8' 
          />    
        </Link>

        {/* Desktop Menu */}
        <div className="hidden sm:flex flex-row items-center gap-4 sm:gap-8">
          {
            menuLinks.map((link, index) => (
              <Link 
                key={index} 
                to={link.path}
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))
          }

          <div className="flex items-center gap-4 sm:gap-6">
            <motion.button 
              onClick={handleDashboardClick}
              className='cursor-pointer hover:text-primary transition-colors'
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              {isOwner ? "Dashboard" : "List Cars"}
            </motion.button>
            
            <motion.button 
              onClick={handleAuthClick}
              className='cursor-pointer px-8 py-2 bg-blue-700 hover:bg-blue-600 transition-all text-white rounded-lg'
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
            >
              {user ? "Log Out" : "Log In"}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <motion.button 
          className='sm:hidden cursor-pointer flex items-center justify-center z-50' 
          aria-label='Menu' 
          onClick={() => setOpen(!open)}
          whileTap={{scale: 0.9}}
        >
          <img src={open ? assets.close_icon : assets.menu_icon} alt="menu" className='w-6 h-6' />
        </motion.button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              exit={{opacity: 0}}
              transition={{duration: 0.3}}
              className="sm:hidden fixed inset-0 bg-black/50 z-40 top-16"
              onClick={() => setOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className={`sm:hidden fixed h-[calc(100vh-4rem)] w-full top-16 right-0 border-t border-borderColor flex flex-col items-start gap-6 p-6 overflow-y-auto z-40 shadow-lg
                ${location.pathname === "/" ? "bg-light" : "bg-white"}
              `}
            >
              {/* Menu Links */}
              <div className="flex flex-col gap-4 w-full">
                {
                  menuLinks.map((link, index) => (
                    <motion.div
                      key={index}
                      custom={index}
                      variants={linkVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <Link 
                        to={link.path}
                        onClick={handleLinkClick}
                        className="block w-full py-2 text-lg hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))
                }
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="flex flex-col gap-4 w-full mt-4"
                custom={menuLinks.length}
                variants={linkVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.button 
                  onClick={handleDashboardClick}
                  className='cursor-pointer w-full text-left py-3 px-4 border border-borderColor rounded-lg hover:bg-gray-50 transition-colors'
                  whileTap={{scale: 0.98}}
                >
                  {isOwner ? "Dashboard" : "List Cars"}
                </motion.button>
                
                <motion.button 
                  onClick={handleAuthClick}
                  className='cursor-pointer w-full py-3 px-4 bg-blue-700 hover:bg-blue-600 transition-all text-white rounded-lg font-medium'
                  whileTap={{scale: 0.98}}
                >
                  {user ? "Log Out" : "Log In"}
                </motion.button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}