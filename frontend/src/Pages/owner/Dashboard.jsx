import React, { use } from 'react'
import { useEffect } from 'react';
import { assets, dummyDashboardData } from '../../assets/assets';

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
    setData(dummyDashboardData);
  }, []);
  return (
    <div>Dashboard</div>
  )
}
