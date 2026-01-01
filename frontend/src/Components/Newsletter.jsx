import React from 'react'
import { motion } from "motion/react"

export default function Newsletter() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const formVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      className="flex flex-col items-center justify-center text-center space-y-2 max-md:px-4 my-10 mb-40"
    >
      <motion.h1 
        variants={itemVariants}
        className="md:text-4xl text-2xl font-semibold"
      >
        Never Miss a Deal!
      </motion.h1>
      
      <motion.p 
        variants={itemVariants}
        className="md:text-lg text-gray-500/70 pb-8"
      >
        Subscribe to get the latest offers, new arrivals, and exclusive discounts
      </motion.p>
      
      <motion.form 
        variants={formVariants}
        className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12"
      >
        <motion.input
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
          type="text"
          placeholder="Enter your email id"
          required
        />
        <motion.button 
          type="submit"
          whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.3)" }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="md:px-12 px-8 h-full text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer rounded-md rounded-l-none"
        >
          Subscribe
        </motion.button>
      </motion.form>
    </motion.div>
  )
}