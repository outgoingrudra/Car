import React from 'react'
import { assets } from '../assets/assets'

export default function Banner() {
  return (
    <div className='relative flex flex-col md:flex-row items-center justify-between px-6 md:px-10 lg:px-14 py-8 md:py-12 bg-gradient-to-br from-[#0558FE] via-[#2B75FF] to-[#A9CFFF] max-w-6xl mx-auto rounded-3xl shadow-2xl overflow-hidden'>
      
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent pointer-events-none"></div>
      
      {/* Content Section */}
      <div className="relative z-10 text-white max-w-xl mb-6 md:mb-0">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          Do you own a luxury car?
        </h2>
        <p className="text-base md:text-lg text-white/90 mb-3 leading-relaxed">
          Turn your premium vehicle into a source of income. Join our platform today!
        </p>
        <p className="text-sm md:text-base text-white/80 leading-relaxed max-w-md">
          List your car with us and start earning. Safe, secure, and hassle-free rental experience guaranteed.
        </p>
        
        {/* Button */}
        <button className='mt-6 px-8 py-3 bg-white hover:bg-gray-50 active:scale-95 transition-all duration-200 text-[#0558FE] font-semibold rounded-xl shadow-lg hover:shadow-xl text-base'>
          List your car
        </button>
      </div>

      {/* Car Image Section */}
      <div className="relative z-10 flex-shrink-0 mt-6 md:mt-0">
        <img 
          src={assets.banner_car_image} 
          alt="Luxury car" 
          className='w-full max-w-sm md:max-w-md lg:max-w-lg h-auto object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-300' 
        />
      </div>
    </div>
  )
}