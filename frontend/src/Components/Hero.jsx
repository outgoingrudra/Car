import React from 'react'
import { assets } from '../assets/assets'

export default function Hero() {
  return (
    <div className='h-screen flex flex-col items-center justify-center gap-14 bg-light text-center'>
      

      <h1 className='text-4xl md:text-5xl font-semibold'>Luxury Cars on Rent</h1>
      <form action=" ">


      </form>
      <img src={assets.main_car} alt="car" className='max-h-74' />

    </div>
  )
}
