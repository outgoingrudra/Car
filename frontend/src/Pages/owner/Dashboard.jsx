import React from 'react'
import { useEffect } from 'react';
import { assets, dummyDashboardData } from '../../assets/assets';
import Title from '../../Components/owner/Title.jsx'

export default function Dashboard() {

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
    console.log(dummyDashboardData)
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
    
   </div>
  )
}
