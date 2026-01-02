import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";
import Title from "../Components/Title";
import { useAppContext } from '../Context/AppContext'
import toast from 'react-hot-toast'

export default function MyBookings() {
  const [bookings, setBookings] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const {axios, user, currency} = useAppContext() 

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const {data} = await axios.get("/api/bookings/user")
      if(data.success) {
        setBookings(data.bookings)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    user && fetchBookings();
  }, [user]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 }
    }
  };

  // Loader Component
  if (isLoading) {
    return (
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl flex items-center justify-center min-h-[60vh]">
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <p className="text-gray-500 text-lg">Loading Your Bookings...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div 
      className="px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Title
          title="My Bookings"
          subTitle="View and manage your all car bookings"
        />
      </motion.div>

      <motion.div variants={containerVariants}>
        {bookings.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-gray-400 text-lg">No bookings found</p>
            <p className="text-gray-500 mt-2">Start exploring cars to make your first booking!</p>
          </motion.div>
        ) : (
          bookings.map((booking, index) => (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12"
              key={index}
              variants={cardVariants}
              whileHover={{ 
                y: -5, 
                boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                transition: { duration: 0.2 }
              }}
            >
              {/* car image and info */}
              <motion.div 
                className="md:col-span-1"
                variants={itemVariants}
              >
                <motion.div 
                  className="rounded-md overflow-hidden mb-3"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={booking.car.image}
                    alt=""
                    className="w-full h-auto aspect-video object-cover"
                  />
                </motion.div>
                <p className="text-lg font-medium mt-2">
                  {booking.car.brand} {booking.car.model}
                </p>
                <p className="text-gray-500">
                  {booking.car.year} . {booking.car.category} .{" "}
                  {booking.car.location}
                </p>
              </motion.div>

              {/* booking info */}
              <motion.div 
                className="md:col-span-2"
                variants={itemVariants}
              >
                <div className="flex items-center gap-2">
                  <motion.p 
                    className="px-3 py-1.5 bg-light rounded"
                    whileHover={{ scale: 1.05 }}
                  >
                    Booking #{index + 1}
                  </motion.p>
                  <motion.p
                    className={`px-3 py-1 text-xs rounded-full ${
                      booking.status == "confirmed"
                        ? "bg-green-400/15 text-green-600"
                        : "bg-red-400/15 text-red-600"
                    }`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {booking.status}
                  </motion.p>
                </div>

                <motion.div 
                  className="flex items-start gap-2 mt-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <img
                    src={assets.calendar_icon_colored}
                    className="w-4 h-4 mt-1"
                    alt=""
                  />
                  <div className="">
                    <p className="text-gray-500">Rental Period</p>
                    <p className="">
                      {booking.pickupDate.split("T")[0]} to {booking.returnDate.split("T")[0]}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-2 mt-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <img
                    src={assets.location_icon_colored}
                    className="w-4 h-4 mt-1"
                    alt=""
                  />
                  <div className="">
                    <p className="text-gray-500">Pick Up Location</p>
                    <p className="">
                      {booking.car.location}
                    </p>
                  </div>
                </motion.div>
              </motion.div>

              {/* prices */}
              <motion.div 
                className="md:col-span-1 flex flex-col justify-between gap-6"
                variants={itemVariants}
              >
                <div className="text-sm text-gray-500 text-right">
                  <p className="">Total Price</p>
                  <motion.h1 
                    className="text-2xl font-semibold text-primary"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  >
                    {currency} {booking.price}
                  </motion.h1>
                  <p className="">
                    Booked on {booking.createdAt.split("T")[0]}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))
        )}
      </motion.div>
    </motion.div>
  );
}