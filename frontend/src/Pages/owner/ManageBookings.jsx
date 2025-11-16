import React, { useEffect, useState } from 'react'
import {dummyMyBookingsData} from "../../assets/assets"
import Title from "../../Components/owner/Title"

export default function ManageBookings() {
  const [bookings ,SetBookings ] = useState([])
      const currency = import.meta.env.VITE_CURRENCY ; 


  const fetchOwnerBookings = async()=>{
    SetBookings(dummyMyBookingsData)
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[])
  return (
      <div className="px-4 pt-10 md:px-10 w-full">
        <Title title="Manage Bookings" subTitle="Lorem ipsum dolor sit amet consectetur adipisicing elit. Excepturi, voluptatibus!"/>
        
        <div className="max-w-3xl w-full rounded-md overflow-hidden border border-borderColor mt-6 ">
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500'>
              <tr>
                <th className='p-3 font-medium'>Car</th>
                <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                <th className='p-3 font-medium'>Total</th>
                <th className='p-3 font-medium max-md:hidden'>payment</th>
                <th className='p-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                bookings.map((booking,idx)=>(
                  <tr key={idx} className="border-t border-borderColor text-gray-500">
                    <td className="p-3 flex items-center gap-3 ">
                      <img src={booking.car.image} alt="" />

                    </td>
                   
    
                  </tr>
                ))
              }
            </tbody>
    
          </table>
    
        </div>
       </div>
  )
}
