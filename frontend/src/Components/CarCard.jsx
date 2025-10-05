import React from 'react'

export default function CarCard({car}) {

    const currency = import.meta.env.VITE_CURRENCY

  return (
    <div className='group rounded-xl overflow-hidden shadow-lg hover:translate-y-1 transition-all duration-500 cursor-pointer '>
        <div className="relative h-48 overflow-hidden">
            <img src={car.image} alt="car image " className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105' />
            {
                car.isAvailable && <p className='absolute top-4 left-4 bg-primary/90 text-white text-xs px-2.5 py-1 rounded-full '>Available Now </p>
            }

            <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-lg ">
                <span className='font-semibold'>{currency}{car.pricePerDay}</span>
                <span className='text-sm text-white/80'> / day</span>
            </div>
        </div>

           <div className="">
            
           </div>
    </div>
  )
}
