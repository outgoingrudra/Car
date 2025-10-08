import React, { use, useEffect, useState } from 'react'
import {useNavigate, useParams } from "react-router-dom"
import {dummyCarData} from "../assets/assets"

export default function CarDetails() {
  const {id} = useParams()
  const navigate = useNavigate()

  const [car , setCar] = useState(null)

  useEffect(()=>{
    setCar(dummyCarData.find(car =>car._id = id))
  },[id])
  return   (
    car ?
    <div className=''>



    </div>
    : <p>Loading ......</p>
  )
}
