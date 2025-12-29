import React from 'react'
import { useEffect } from 'react';
import { assets, dummyDashboardData } from '../../assets/assets';
import Title from '../../Components/owner/Title.jsx'

export default function Dashboard() {
  const currency = import.meta.env.VITE_CURRENCY ; 

  const [data , setData] = React.useState({
    totalCars : 0,
    totalBookings : 0,
    pendingBookings : 0,
    completedBookings : 0 ,
    recentBookings : [],
    monthlyRevenue : 0
  });

  const dashboardCards =[
    {title : "Total Cars" , value : data.totalCars ,icon : assets.carIconColored},
    {title : "Total Bookings" , value : data.totalBookings ,icon : assets.listIconColored},  
    {title : "Pending" , value : data.pendingBookings ,icon : assets.cautionIconColored},
    {title : "Confirmed" , value : data.completedBookings ,icon : assets.listIconColored},
  ]

  useEffect(() => {
    // Fetch dashboard data from API
    
    setData(dummyDashboardData);
  }, []);
  return (
   <div className="px-4 pt-10 md:px-10 flex-1 ">
    <Title title="Admin Dashboard"  subTitle="Monitor overall platform performance including total cars , bookings , revenue and recent activites" />
     


     <div className="grid  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 my-8 max-w-3xl ">
            {
              dashboardCards.map((card , index) => (
                     <div  key={index} className="flex gap-2 items-center justify-between p-4 
                     rounded-md border border-borderColor">

                      <div className="">
                        <h1 className="text-xs text-gray-500">{card.title}</h1>
                        <p className="text-lg font-semibold">{card.value}</p>
                      </div>
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                        
                        <img src={card.icon} className='h-4 w-4 ' alt="" />

                      </div>

                     </div>
              ))
            }
     </div>
    
{/* recent bookings */}
    <div className="flex felx-wrap items-start gap-6 mb-6 w-full">


       <div className="p-4 md:p-6 border border-borderColor rounded-md w-full max-w-lg ">
        <h1 className="text-lg font-medium">Recent Bookings </h1>
        <p className="text-gray-500">
          Latest Customer Bookings 
        </p>
        {
          data.recentBookings.map((booking , index) => (
            <div key={index} className="mt-4 flex items-center justify-between ">
                      <div className="flex items-center gap-2">
                           <div className="">
                            <img src={assets.listIconColored} alt="" className='h-5 w-5 ' />
                           </div>
                      </div>

                      <div className="">
                        <p className="">{booking.car.brand} {booking.car.model}</p>
                        <p className="text-sm text-gray-500">
                          {booking.createdAt.split('T')[0]}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 font-medium">
                        <p className="text-sm text-gray-500">{currency} {booking.price}</p>
                        <p className="px-3 py-0.5 border border-borderColor rounded-full  text-sm ">{booking.status}</p>

                      </div>
            </div>
          ))
        }

       </div>


    </div>

    {/* monthly revenue  */}
    <div className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-lg ">
       
       <h1 className="text-lg font-medium">Monthly Revenue </h1>
       <p className="text-gray-500">
        Revenue for Current Month 
       </p>
       <p className="text-3xl mt-6 font-semibold text-primary">
        {currency} {data.monthlyRevenue}
       </p>

    </div>


   </div>
  )
}
