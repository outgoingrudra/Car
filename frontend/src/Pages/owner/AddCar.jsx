import React, { useState } from 'react'
import Title from "../../Components/owner/Title"
import {assets} from "../../assets/assets"

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
    
    <form action="" onSubmit={onsubmitHandler} className='flex flex-col gap-5 text-gray-500 text-sm mt-6 max-w-xl'>
             {/* car image  */}
             <div className="flex items-center  gap-2 w-full">
              <label htmlFor="car-image">
                <img src={image ? URL.createObjectURL(image) : assets.upload_icon} alt="" 
                className='h-14 rounded cursor-pointer'/>
                <input type="file" name="" id="car-image"  accept='image/*' hidden onChange={(e)=>setImage(e.target.files[0])}/>
              </label>
              <p className='text-sm text-gray-500'> Upload a picture of the car</p>
             </div>

             {/* car brand and model  */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
              <div className="flex flex-col w-full">
                <label htmlFor="">Brand </label>
                <input type="text" placeholder='e.g- BMW , Mercedes ...' required className='px-3 py-2 
                mt-1  border border-borderColor rounded-md outline-none' value={car.brand} onChange={(e)=>setCar({...car,brand :e.target.value})} />
              </div>
              <div className="flex flex-col w-full">
                <label htmlFor="">Model </label>
                <input type="text" placeholder='e.g- X5 , E-Class ...' required className='px-3 py-2 
                mt-1  border border-borderColor rounded-md outline-none' value={car.model} onChange={(e)=>setCar({...car,model :e.target.value})} />
              </div>
             </div>

             

    </form>
   </div>
  )
}
