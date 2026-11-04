import React from 'react'
import { useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../../assets/assets';
import Title from '../../Components/owner/Title.jsx'
import { useAppContext } from '../../Context/AppContext.jsx';
import OwnerSkeleton from '../../Components/owner/OwnerSkeleton';

export default function Dashboard() {

  const {axios, isOwner, currency} = useAppContext()
  
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  const [data, setData] = React.useState({
    totalCars: 0,
    totalBookings: 0,
    pendingBookings: 0,
    completedBookings: 0,
    recentBookings: [],
    monthlyRevenue: 0
  });

  const dashboardCards = [
    {title: "Total Cars", value: data.totalCars, icon: assets.carIconColored},
    {title: "Total Bookings", value: data.totalBookings, icon: assets.listIconColored},  
    {title: "Pending", value: data.pendingBookings, icon: assets.cautionIconColored},
    {title: "Confirmed", value: data.completedBookings, icon: assets.listIconColored},
  ]

  const fetchDashboardData = useCallback(async()=>{
    try {
      setIsLoading(true);
      setError("");
      const {data} = await axios.get("/api/owner/dashboard")
      
      if(data.success) {
        setData(data.dashboardData)
      } else {
        setError(data.message || "Could not load your dashboard")
      }
      
    } catch (error) {
      setError(error.response?.data?.message || error.message)
    } finally {
      setIsLoading(false);
    }
  }, [axios])

  useEffect(() => {
    if(isOwner)
      fetchDashboardData()
  }, [isOwner, fetchDashboardData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" }
    }
  }

  if (isLoading || error) {
    return (
      <div className="min-w-0 px-4 py-10 md:px-10">
        <Title title="Owner Dashboard" subTitle="Keep track of your cars, bookings, and monthly revenue." />
        <div className="my-8 max-w-3xl">
          {isLoading ? <OwnerSkeleton variant="dashboard" label="Loading your dashboard" /> : <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-6"><p>{error}</p><button onClick={fetchDashboardData} className="mt-3 font-medium text-primary">Try again</button></div>}
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      className="min-w-0 px-4 py-10 md:px-10"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Title title="Owner Dashboard" subTitle="Keep track of your cars, bookings, and monthly revenue." />
      </motion.div>

      <motion.div 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-8 max-w-3xl"
        variants={containerVariants}
      >
        {
          dashboardCards.map((card, index) => (
            <motion.div  
              key={index} 
              className="flex gap-2 items-center justify-between p-4 rounded-md border border-borderColor"
              variants={cardVariants}
              whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="">
                <h1 className="text-xs text-gray-500">{card.title}</h1>
                <motion.p 
                  className="text-lg font-semibold"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                >
                  {card.value}
                </motion.p>
              </div>
              <motion.div 
                className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <img src={card.icon} className='h-4 w-4' alt="" />
              </motion.div>
            </motion.div>
          ))
        }
      </motion.div>
    
      {/* recent bookings */}
      <motion.div 
        className="flex flex-wrap items-start gap-6 mb-6 w-full"
        variants={itemVariants}
      >
        <motion.div 
          className="p-4 md:p-6 border border-borderColor rounded-md w-full max-w-lg"
          whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-lg font-medium">Recent Bookings</h1>
          <p className="text-gray-500">Latest Customer Bookings</p>
          
          {data.recentBookings.length === 0 ? (
            <motion.p 
              className="mt-4 text-center text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              No recent bookings
            </motion.p>
          ) : (
            data.recentBookings.map((booking, index) => (
              <motion.div 
                key={index} 
                className="mt-4 flex items-center justify-between"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ x: 5, backgroundColor: "rgba(0,0,0,0.02)" }}
              >
                <div className="flex items-center gap-2">
                  <div className="">
                    <img src={assets.listIconColored} alt="" className='h-5 w-5' />
                  </div>
                </div>

                <div className="">
                  <p className="">{booking.car ? `${booking.car.brand} ${booking.car.model}` : "Car no longer listed"}</p>
                  <p className="text-sm text-gray-500">
                    {booking.createdAt.split('T')[0]}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <p className="text-sm text-gray-500">{currency} {booking.price}</p>
                  <motion.p 
                    className="px-3 py-0.5 border border-borderColor rounded-full text-sm"
                    whileHover={{ scale: 1.05 }}
                  >
                    {booking.status}
                  </motion.p>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>
      </motion.div>

      {/* monthly revenue */}
      <motion.div 
        className="p-4 md:p-6 mb-6 border border-borderColor rounded-md w-full md:max-w-lg"
        variants={itemVariants}
        whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-lg font-medium">Monthly Revenue</h1>
        <p className="text-gray-500">Revenue for Current Month</p>
        <motion.p 
          className="text-3xl mt-6 font-semibold text-primary"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {currency} {data.monthlyRevenue}
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
