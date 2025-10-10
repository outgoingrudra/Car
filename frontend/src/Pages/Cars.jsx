import React from 'react'
import Title from '../Components/Title'
import { assets } from '../assets/assets'

export default function Cars() {

  const [input, setInput] = React.useState("")
  return (
    <div className=''>

      <div className="flex flex-col items-center py-20 bg-light max-md:px-4 ">
        <Title title="Available Cars "  subTitle="Browse Our Selection of premium vehicles available for you next adventure " />

        <div className="flex items-center bg-white px-4 mt-6 max-w-96 w-full h-12 rounded-full shadow-md ">
          <img src={assets.search_icon} alt="" className='w-4.5 h-4.5 mr-2 ' />
          <input  onChange={(e)=>setInput(e.target.value)} type="text"  placeholder='Search by make . model or features'  className='w-full h-full outline-none text-gray-600'/>
          <img src={assets.filter_icon} alt="" className='w-4.5 h-4.5 mr-2 ' />

        </div>

      </div>

      <div className="
      ">

      </div>
    </div>
  )
}
