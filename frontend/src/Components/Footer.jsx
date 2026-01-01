import React from 'react'
import { motion } from "motion/react"
import {assets} from "../assets/assets"

export default function Footer() {
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

  const socialVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1]
      }
    })
  }

  const bottomVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.8,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className='flex flex-wrap justify-between items-start gap-8 pb-6 border-b border-borderColor md:gap-6'
      >
        <motion.div variants={itemVariants} className='max-w-80'>
          <motion.img 
            src={assets.logo} 
            alt="logo" 
            className='h-8 md:h-9'
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          />
          <p className='max-w-80 mt-3'>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
          </p>
          <div className='flex items-center gap-3 mt-4'>
            {[assets.facebook_logo, assets.instagram_logo, assets.twitter_logo, assets.gmail_logo].map((logo, i) => (
              <motion.a 
                key={i}
                href=""
                custom={i}
                variants={socialVariants}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 5,
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.9 }}
              >
                <img src={logo} className='w-5 h-5' alt="" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className='text-base font-medium uppercase text-gray-800'>Quick Links</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            {['Home', 'Browse Cars', 'List your car', 'About'].map((link, i) => (
              <motion.li 
                key={i}
                whileHover={{ x: 5, color: '#1f2937' }}
                transition={{ duration: 0.2 }}
              >
                <a href="#">{link}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className='text-base font-medium uppercase text-gray-800'>Resources</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            {['Help Center', 'Terms of Services', 'Privacy Policy', 'Insurance'].map((link, i) => (
              <motion.li 
                key={i}
                whileHover={{ x: 5, color: '#1f2937' }}
                transition={{ duration: 0.2 }}
              >
                <a href="#">{link}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className='text-base font-medium uppercase text-gray-800'>Contact</p>
          <ul className='mt-3 flex flex-col gap-2 text-sm'>
            {['1234, Los Angeles', 'USA - North', '+1 232 444 555', 'dummy@gmail.com'].map((info, i) => (
              <motion.li 
                key={i}
                whileHover={{ x: 5, color: '#1f2937' }}
                transition={{ duration: 0.2 }}
              >
                <a href="#">{info}</a>
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </motion.div>

      <motion.div 
        variants={bottomVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'
      >
        <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">PrebuiltUI</a>. All rights reserved. - <a href="https://github.com/outgoingrudra"><b>Rudra Verma</b></a></p>
        <ul className='flex items-center gap-4'>
          <li><a href="#">Privacy</a> <span> | </span></li>
          <li><a href="#">Terms</a><span> | </span></li>
          <li><a href="#">Sitemap</a><span> | </span></li>
        </ul>
      </motion.div>
    </div>
  )
}