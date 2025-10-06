import React from 'react'
import { assets } from '../assets/assets'

export default function Banner() {
  return (
    <div className='flex flex-col md:flex-row md:items-start items-center justify-between px-8 min-md:pl-14 pt-10 bg-gradient-to-r from-[#0558FE] to-[#A9CFFF] 
     max-w-6xl md:mx-auto rounded-2xl overflow-hidden
    ' >
        <div className="text-white">
            <h2 className="text-3xl font-medium ">
                Do you own a luxury car ? 
            </h2>
            <p className="mt-2">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus, ducimus?</p>
            <p className="max-w-130">Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur excepturi possimus eaque? Eos quidem tempore quaerat?</p>
        </div>
        <button className='px-6 py-2  bg-white hover:bg-slate-100 transition-all  text-primary rounded-lg  text-sm mt-4 cursor-pointer' >
            List your car
        </button>

        <img src={assets.banner_car_image} alt="" className='max-h-45 mt-10' />


    </div>
  )
}
