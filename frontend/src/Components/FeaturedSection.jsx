import React from 'react'
import Title from './Title'
import {dummyCarData} from "../assets/assets"
import CarCard from "../Components/CarCard"

export default function FeaturedSection() {
  return (
    
    <div className="    flex flex-col items-center py-24 px-6 md:px-16 lg:px-24  xl:px-32">

        <div className="">
            <Title title ="Featured Vehicles " subTitle="explore our selection of premium  vehicles available for your next adventure "  />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">

          {
            dummyCarData.slice(0,6).map((car)=>(
              <div className="" key={car._id}>
                <CarCard car={car} />
              </div>
            ))
          }

        </div>
        <button>
          Ex
        </button>

    </div>
  )
}
