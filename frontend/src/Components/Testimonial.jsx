import React from 'react'
import Title from './Title'
import { assets } from '../assets/assets';
import { motion } from 'motion/react';

export default function Testimonial() {

  const testimonials = [
    {   
        name: "Emma Rodriguez", 
        location: "Barcelona, Spain",
        image: assets.testimonial_image_1, 
        testimonial: "I have rented a car from this platform multiple times and the experience has always been exceptional. The luxury cars are well-maintained, clean, and the booking process is incredibly smooth. Highly recommend for anyone looking for premium car rentals!" 
    },
    {   
        name: "Sophia Lee", 
        location: "Seoul, South Korea", 
        image: assets.testimonial_image_2, 
        testimonial: "Fantastic experience! From start to finish, the team was professional, responsive, and genuinely cared about delivering great results. The car was delivered right to my doorstep and pickup was hassle-free. Will definitely use this service again!" 
    },
    {   
        name: "Michael Chen", 
        location: "Singapore", 
        image: assets.testimonial_image_3, 
        testimonial: "Best car rental service I've ever used! The entire process was seamless - from browsing luxury vehicles to returning the car. Customer support was outstanding and answered all my questions promptly. Five stars all the way!" 
    }
];

  return (
   
     <div className="py-28 px-6 md:px-16 lg:px-24  xl:px-44">
        <Title title="What our customers say  " subTitle="Discover why discrening travelers choose stayVenture  for their luxury accomodations around the world "  />
           

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-18">
                {testimonials.map((testimonial,index) => (
                    <motion.div
                    initial={{opacity:0,y:40}}
                    whileInView={{opacity:1,y:0}}
                    transition={{duration:0.6,delay:index*0.2 ,ease:"easeOut"}}
                    viewport={{once:true,amount:0.3}}
                    key={index} className="bg-white p-6 rounded-xl shadow-lg hover:-translate-y-1 transition-all duration-500">
                        <div className="flex items-center gap-3">
                            <img className="w-12 h-12 rounded-full" src={testimonial.image} alt={testimonial.name} />
                            <div>
                                <p className="font-playfair text-xl">{testimonial.name}</p>
                                <p className="text-gray-500">{testimonial.location}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 mt-4">
                            {Array(5).fill(0).map((_, index) => (
                              <img key={index} src={assets.star_icon} alt="Star Icon"
                              />
                            ))}
                        </div>
                        <p className="text-gray-500 max-w-90 mt-4 font-light">"{testimonial.testimonial}"</p>
                    </motion.div>
                ))}
            </div>
        </div>
  )
}
