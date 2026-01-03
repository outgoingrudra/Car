import React from 'react'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'
import { useNavigate } from "react-router-dom"

export default function CarCard({car}) {
    const navigate = useNavigate()
    const currency = import.meta.env.VITE_CURRENCY

  return (
    <motion.div 
      onClick={() => {
        navigate(`/car-details/${car._id}`)
        scrollTo(0, 0)
      }} 
      className='group rounded-xl overflow-hidden shadow-lg hover:translate-y-1 transition-all duration-500 cursor-pointer'
      whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
        <div className="relative h-48 overflow-hidden">
            <motion.img 
              src={car.image} 
              alt="car image" 
              className='w-full h-full object-cover'
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.5 }}
            />
            {
                car.isAvailable && (
                  <motion.p 
                    className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full'
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Available Now
                  </motion.p>
                )
            }

            <motion.div 
              className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
                <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                <span className='text-sm text-white/80'> / day</span>
            </motion.div>
        </div>

        <div className="p-4 sm:p-5">
            <div className="flex justify-between items-start mb-2">
                <div className="">
                    <h3 className="text-lg font-medium">
                        {car.brand} {car.model}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                        {car.category} . {car.year}
                    </p>
                </div>
            </div>

            <motion.div 
              className="mt-4 grid grid-cols-2 gap-y-2 text-gray-600"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.2
                  }
                }
              }}
            >
                {[
                  { icon: assets.users_icon, text: `${car.seating_capacity} Seats` },
                  { icon: assets.fuel_icon, text: car.fuel_type },
                  { icon: assets.car_icon, text: car.transmission },
                  { icon: assets.location_icon, text: car.location }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center text-sm text-muted-foreground"
                    variants={{
                      hidden: { opacity: 0, x: -10 },
                      visible: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ x: 5 }}
                  >
                    <img src={item.icon} alt="" className='h-4 mr-2' />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
            </motion.div>
        </div>
    </motion.div>
  )
}