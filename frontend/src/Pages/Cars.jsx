import React, { useEffect, useState } from 'react'
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

  const {cars,axios} = useAppContext()

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
  return (
    <div className=''>

      <div className="flex flex-col items-center py-20 bg-light max-md:px-4 ">
        <Title title="Available Cars "  subTitle="Browse Our Selection of premium vehicles available for you next adventure " />

        <div className="flex items-center bg-white px-4 mt-6 max-w-96 w-full h-12 rounded-full shadow-md ">
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2 ' />
          <input  onChange={(e)=>setInput(e.target.value)} type="text"  placeholder='Search by make . model or features'  className='w-full h-full outline-none text-gray-600'/>
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 mr-2 ' />

        </div>

      </div>

      <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-10 
      ">

        <p className="">Showing {filterdCars.length} Cars </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-4 xl:px-20 max-w-7xl mx-auto ">

          {
            filterdCars.map((car, index) => (
              <div className="" key={index}>
                <CarCard car={car} />
              </div>
            ))
          }
        </div>

      </div>
    </div>
  )
}
