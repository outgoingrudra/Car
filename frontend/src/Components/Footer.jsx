import React from 'react'
import {assets} from "../assets/assets"

export default function Footer() {
  return (
    
      <div className='px-6 md:px-16 lg:px-24 xl:px-32 mt-60 text-sm text-gray-500'>
            <div className='flex flex-wrap justify-between items-start gap-8 pb-6 border-borderColor md:gap-6'>
                <div className='max-w-80'>
                    <img src={assets.logo} alt="logo" className='h-8 md:h-9' />
                    <p className='max-w-80 mt-3'>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text
                    </p>
                    <div className='flex items-center gap-3 mt-4'>
                       <a href=""><img src={assets.facebook_logo} className='w-5 h-5' alt="" /></a>
                       <a href=""><img src={assets.instagram_logo} className='w-5 h-5' alt="" /></a>
                       <a href=""><img src={assets.twitter_logo} className='w-5 h-5' alt="" /></a>
                       <a href=""><img src={assets.gmail_logo} className='w-5 h-5' alt="" /></a>
                    </div>
                </div>

                <div>
                    <p className='text-base font-medium  uppercase text-gray-800'>Quick Links </p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Home</a></li>
                        <li><a href="#">Browse Cars</a></li>
                        <li><a href="#">List your car</a></li>
                        <li><a href="#">About</a></li>
                      
                    </ul>
                </div>


                 <div>
                    <p className='text-base font-medium  uppercase text-gray-800'>Resources  </p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">Help Center</a></li>
                        <li><a href="#">Terms of Services </a></li>
                        <li><a href="#">Privacy Policy </a></li>
                        <li><a href="#">Insurence </a></li>
                      
                    </ul>
                </div>


                  <div>
                    <p className='text-base font-medium  uppercase text-gray-800'>Contact  </p>
                    <ul className='mt-3 flex flex-col gap-2 text-sm'>
                        <li><a href="#">1234, Los Angeles</a></li>
                        <li><a href="#">USA -North </a></li>
                        <li><a href="#">+1 232 444 555</a></li>
                        <li><a href="#">dummy@gmail.com  </a></li>
                      
                    </ul>
                </div>

                
                
            </div>
            <hr className='border-gray-300 mt-8' />
            <div className='flex flex-col md:flex-row gap-2 items-center justify-between py-5'>
                <p>© {new Date().getFullYear()} <a href="https://prebuiltui.com">PrebuiltUI</a>. All rights reserved.</p>
                <ul className='flex items-center gap-4'>
                    <li><a href="#">Privacy</a></li>
                    <li><a href="#">Terms</a></li>
                    <li><a href="#">Sitemap</a></li>
                </ul>
            </div>
        </div>
  )
}
