import React, { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Title from '../Components/Title'
import { assets } from '../assets/assets'
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

  const [availableCars, setAvailableCars] = useState([])
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState("")
  const [sort, setSort] = useState("featured")

  useEffect(() => {
    if (!isSearchedData) return
    let active = true
    const search = async () => {
      setLoading(true)
      try {
        const { data } = await axios.post("/api/bookings/check-availability", {
          location: pickUpLocation, pickupDate, returnDate
        })
        if (!active) return
        if (data.success) setAvailableCars(data.availableCars)
        else {
          setAvailableCars([])
          toast.error(data.message)
        }
      } catch (error) {
        if (active) toast.error(error.response?.data?.message || error.message)
      } finally {
        if (active) setLoading(false)
      }
    }
    search()
    return () => { active = false }
  }, [axios, pickUpLocation, pickupDate, returnDate, isSearchedData])

  const filteredCars = useMemo(() => {
    const query = input.trim().toLowerCase()
    const result = (isSearchedData ? availableCars : cars).filter((car) =>
      [car.brand, car.model, car.category, car.transmission, car.location]
        .some((value) => value?.toLowerCase().includes(query))
    )
    if (sort === "price-low") result.sort((a, b) => a.pricePerDay - b.pricePerDay)
    if (sort === "price-high") result.sort((a, b) => b.pricePerDay - a.pricePerDay)
    if (sort === "newest") result.sort((a, b) => b.year - a.year)
    return result
  }, [availableCars, cars, input, isSearchedData, sort])

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
            value={input}
            onChange={(e)=>setInput(e.target.value)} 
            type="text"  
            placeholder='Search by make, model or features'  
            className='w-full h-full outline-none text-gray-600'
          />
        </motion.div>

      </motion.div>

      <motion.div 
        className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >

        <motion.div
          className="flex flex-wrap items-center justify-between gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>{loading ? "Checking availability..." : `Showing ${filteredCars.length} cars`}</p>
          <label className="flex items-center gap-2 text-sm">
            Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-borderColor bg-white px-3 py-2">
              <option value="featured">Featured</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="newest">Newest year</option>
            </select>
          </label>
        </motion.div>

        {!loading && filteredCars.length === 0 && (
          <p className="mt-8 text-center text-gray-500">No cars match this search. Try another term or date.</p>
        )}

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {
            filteredCars.map((car, index) => (
              <motion.div 
                className="" 
                key={car._id}
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
