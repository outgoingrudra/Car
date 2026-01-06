import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {useAppContext} from "../Context/AppContext"
export default function EmailSender() {
  const [message, setMessage] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const {axios} = useAppContext()
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setIsLoading(true)
    
    // TODO: Add your backend API call here
    // Example:
    // const response = await axios.post('/api/send-email', { message, password })
       try {
         const  {data} = await axios.post("/api/users/send-email",{message,password})
          if(data.success){
        console.log("Email Sent Successfully !!")

    }
          else {
        console.log("Server side issue in email sending");
        
    }
       } catch (error) {
          console.log("client-side error ! Not Permitted ! ");
       }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      // Reset form after success
      setMessage('')
      setPassword('')
    }, 2000)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  const headerVariants = {
    hidden: { opacity: 0, y: -30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4 py-12"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div 
        className="w-full max-w-2xl"
        variants={containerVariants}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          variants={headerVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Email Broadcast
          </h1>
          <p className="text-gray-600">
            Send a message to all users via email
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6"
          variants={itemVariants}
          whileHover={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Message Field */}
          <motion.div variants={itemVariants}>
            <label 
              htmlFor="message" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Message
            </label>
            <motion.textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={8}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
            <p className="text-xs text-gray-500 mt-2">
              {message.length} characters
            </p>
          </motion.div>

          {/* Password Field */}
          <motion.div variants={itemVariants}>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Admin Password
            </label>
            <motion.input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              whileFocus={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            variants={itemVariants}
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <motion.svg 
                  className="w-5 h-5"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </motion.svg>
                Sending...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
                Send to All Users
              </span>
            )}
          </motion.button>

          {/* Info Box */}
          <motion.div 
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" 
                  clipRule="evenodd" 
                />
              </svg>
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Important:</p>
                <p>This will send the message to all registered users' email addresses. Please verify your message before sending.</p>
              </div>
            </div>
          </motion.div>
        </motion.form>

        {/* Footer */}
        <motion.p 
          className="text-center text-gray-500 text-sm mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Only authorized administrators can send broadcast emails
        </motion.p>
      </motion.div>
    </motion.div>
  )
}