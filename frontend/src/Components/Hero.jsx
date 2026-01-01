import React, { useState } from 'react'
import { assets, cityList } from '../assets/assets'
import { useAppContext } from '../Context/AppContext'

export default function Hero() {

  const [pickUp , setPickUp] = useState("")

  const {  pickupDate, setPickupDate, returnDate, setReturnDate , navigate} = useAppContext()

  const handleSearch = async(e)=>{
         e.preventDefault();
         navigate("/cars?pickupLocation="+pickUp+"&pickupDate="+pickupDate+"&returnDate="+returnDate)

  }
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center px-6'>
      

      <h1 className='text-4xl md:text-5xl font-semibold'>Luxury Cars on Rent</h1>
      <form onSubmit={handleSearch} action="" className='
      flex flex-col md:flex-row items-stretch md:items-center justify-center gap-6 md:gap-4 p-6 rounded-lg md:rounded-full w-full max-w-80 md:max-w-5xl
      bg-white shadow-[0px_8px_20px_rgba(0,0,0,0.1)]
      '>

        <div className="flex flex-col items-start w-full md:w-auto md:flex-1">
          <select value={pickUp} onChange={(e)=>setPickUp(e.target.value)} name="" id="" required className='w-full px-2 py-1 outline-none bg-transparent'>
            <option value="">Pick Up Location </option>
            {
              cityList.map((city)=>(<option value={city} key={city}>{city}</option>))
            }
          </select>

          <p className="px-2 text-sm text-gray-500 text-left w-full">
          {pickUp ? pickUp : "Please select location"}
          </p>
        </div>

        <div className="flex flex-col items-start w-full md:w-auto md:flex-1 cursor-pointer" onClick={() => document.getElementById('pickup-date').showPicker()}>
  <label htmlFor="pickup-date" className='px-2 text-sm font-medium pointer-events-none'>Pick-Up Date</label>
  <input value={pickupDate} onChange={(e)=>setPickupDate(e.target.value)} type="date" name="" id="pickup-date" min={new Date().toISOString().split('T')[0]} className='w-full px-2 py-1 text-sm text-gray-500 outline-none bg-transparent pointer-events-none' required />
</div>

<div className="flex flex-col items-start w-full md:w-auto md:flex-1 cursor-pointer" onClick={() => document.getElementById('return-date').showPicker()}>
  <label htmlFor="return-date" className='px-2 text-sm font-medium pointer-events-none'>Return Date</label>
  <input value={returnDate} onChange={(e)=>setReturnDate(e.target.value)} type="date" name="" id="return-date" className='w-full px-2 py-1 text-sm text-gray-500 outline-none bg-transparent pointer-events-none' required />
</div>
        <button type="submit" className='flex items-center justify-center gap-1 px-9 py-3 md:px-6 md:py-2 bg-primary hover:bg-primary-dull text-white rounded-full cursor-pointer whitespace-nowrap'>
          <img src={assets.search_icon} alt="" className='brightness-300 h-4'/>
          Search
        </button>

      </form>
      <img src={assets.main_car} alt="car" className='max-h-96 w-auto object-contain' />

    </div>
  )
}