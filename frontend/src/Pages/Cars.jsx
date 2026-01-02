import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Title from '../Components/Title'
import { assets, dummyCarData } from '../assets/assets'
import CarCard from '../Components/CarCard'
import { useSearchParams } from 'react-router-dom'
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

export default function Cars() {

  //getting search params from url
  const [searchParams] = useSearchParams()
  const pickUpLocation = searchParams.get('pickupLocation')
  const pickupDate = searchParams.get('pickupDate')
  const returnDate = searchParams.get('returnDate')

  const {cars, axios} = useAppContext()

  const isSearchedData = pickUpLocation && pickupDate && returnDate

  const [filterdCars, setFilteredCars] = useState([])

  const searchCarAvailability = async()=>{

    const {data} = await axios.post("/api/bookings/check-availability",{location : pickUpLocation , pickupDate ,returnDate})

    if(data.success)
       setFilteredCars(data.availableCars)
      if(data.availableCars.length == 0)
      {
        toast("No Cars Available ")
      }
      return null
  }

  useEffect(()=>{
    isSearchedData && searchCarAvailability()
  },[])

  const [input, setInput] = React.useState("")

const applyFilter = async () => {
  if (input === "") {
    setFilteredCars(cars)
    return null
  }
  
  const filtered = cars.slice().filter((car) => {
    return car.brand.toLowerCase().includes(input.toLowerCase())
      || car.model.toLowerCase().includes(input.toLowerCase())
      || car.category.toLowerCase().includes(input.toLowerCase())
      || car.transmission.toLowerCase().includes(input.toLowerCase())
  })
  
  setFilteredCars(filtered)
}

  useEffect(()=>{
    cars.length > 0 && !isSearchedData && applyFilter()},[input,cars]
  )

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  const searchBarVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", delay: 0.2 }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  return (
    <div className=''>

      <motion.div 
        className="flex flex-col items-center py-20 bg-light max-md:px-4"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={headerVariants}>
          <Title title="Available Cars" subTitle="Browse Our Selection of premium vehicles available for you next adventure" />
        </motion.div>

        <motion.div 
          className="flex items-center bg-white px-4 mt-6 max-w-96 w-full h-12 rounded-full shadow-md"
          variants={searchBarVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2' />
          <input 
            onChange={(e)=>setInput(e.target.value)} 
            type="text"  
            placeholder='Search by make, model or features'  
            className='w-full h-full outline-none text-gray-600'
          />
          <motion.img 
            src={assets.filter_icon} 
            alt="" 
            className='w-4.5 h-4.5 mr-2 cursor-pointer' 
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
          />
        </motion.div>

      </motion.div>

      <motion.div 
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >

        <motion.p 
          className=""
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Showing {filterdCars.length} Cars
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {
            filterdCars.map((car, index) => (
              <motion.div 
                className="" 
                key={index}
                variants={cardVariants}
                custom={index}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
              >
                <CarCard car={car} />
              </motion.div>
            ))
          }
        </motion.div>

      </motion.div>
    </div>
  )
}