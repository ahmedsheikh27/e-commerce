import Link from 'next/link'
import React from 'react'
import { FaOpencart } from 'react-icons/fa'
import { TbShoppingBag } from 'react-icons/tb'

const Navbar = () => {
  return (
    <div className='bg-[#304b3c] flex items-center justify-between w-full p-4 border-b-[1px] '>
        <Link href='/'>
      <div className="flex items-center gap-2 cursor-pointer">
        {/* Shopping Cart Icon */}
        <FaOpencart size={50} className="text-[#fae282]" />
        {/* Logo Text */}
        <h1 className="text-[32px] font-bold text-white" >
          Cart<span className="text-[#92ffe7]">ify</span>
        </h1>

      </div>
        </Link>
      <div className='hidden md:flex gap-10'>
        <h2 className='hover:bg-[#92ffe7] text-white cursor-pointer p-2 px-3 rounded-full hover:text-black '>Home</h2>
        <h2 className='hover:bg-[#92ffe7] text-white cursor-pointer p-2 px-3 rounded-full hover:text-black '>History</h2>
        <h2 className='hover:bg-[#92ffe7] text-white cursor-pointer p-2 px-3 rounded-full hover:text-black '>Contact us</h2>
      </div>
      <div className='flex justify-between gap-3 items-center'>
      <h2 className=' bg-[#92ffe7] cursor-pointer p-2 px-3 rounded-full '>Menu</h2>
      <Link href='/cart'>
      <TbShoppingBag size={40} className="bg-[#fae282] border-[1px ] rounded-full p-1 cursor-pointer" />
      </Link>
   
      </div>
      
    </div>
  )
}

export default Navbar