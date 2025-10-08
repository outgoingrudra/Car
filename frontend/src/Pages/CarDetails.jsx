import React, { use, useEffect, useState } from 'react'
import {useNavigate, useParams } from "react-router-dom"
import {assets, dummyCarData} from "../assets/assets"

export default function CarDetails() {
  const {id} = useParams()
  const navigate = useNavigate()

  const [car , setCar] = useState(null)

  useEffect(()=>{
    setCar(dummyCarData.find(car =>car._id = id))
  },[id])
  return   (
    car ?
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-16'>
      <button onClick={()=>navigate(-1)} className='flex items-center gap-2 mb-6 text-gray-600  cursor-pointer '>
        <img src={assets.arrow_icon} alt="" className='rotate-180 opacity-65 '/>
        Back to All cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 ">

        {/* car image and details */}

        

      </div>



    </div>
    : <p>Loading ......</p>
  )
}
