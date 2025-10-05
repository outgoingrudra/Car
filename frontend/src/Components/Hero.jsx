import React from 'react'
import { assets, cityList } from '../assets/assets'

export default function Hero() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center px-6'>
      

      <h1 className='text-4xl md:text-5xl font-semibold'>Luxury Cars on Rent</h1>
      <form action="" className='
      flex flex-col md:flex-row items-center justify-center p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-3xl
      bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]
      '>

        <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 w-full">
          <div className="flex flex-col items-start w-full md:w-auto">
            <select name="" id="" required className='w-full md:w-auto px-2 py-1 outline-none bg-transparent'>
              <option value="">Pick Up Location </option>
              {
                cityList.map((city)=>(<option value={city} key={city}>{city}</option>))
              }
            </select>

            <p className="px-2 text-sm text-gray-500 text-left md:text-center w-full">
              Please select location
            </p>
          </div>

        </div>


      </form>
      <img src={assets.main_car} alt="car" className='max-h-96 w-auto object-contain' />

    </div>
  )
}