import React, { useState } from 'react'
import Title from "../../Components/owner/Title"

export default function AddCar() {

  const [image , setImage ]= useState(null)
  const [car , setCar ]= useState({
    brand : "",
    model : "",
    year : 0,
    pricePerDay : 0,
    category : '' ,
    transmission : '',
    fuel_type : "",
    seating_capacity : 0,
    location : "",
    description : ""

  })


  const onsubmitHandler = async(e)=>{
         
  }

  return (
   <div className="px-4 py-10 md:px-10 flex-1">
    <Title  title="ADD NEW CAR " subTitle="Fill in Details to list a new car for booking , including pricing , availability and car specification "/>
    
    <form action="" onSubmit={onsubmitHandler}>

    </form>
   </div>
  )
}
