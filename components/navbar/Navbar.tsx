'use client'
import { useCartContext } from '@/context/CartContext'
import Link from 'next/link'
import React from 'react'
import { FaOpencart } from 'react-icons/fa'
import { TbShoppingBag } from 'react-icons/tb'

const Navbar = () => {
  const { cart } = useCartContext()
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
        <div className='relative'>
          <Link href='/cart'>
            <div className="relative">
              <TbShoppingBag
                size={40}
                className="bg-[#fae282] border-[1px] rounded-full p-1 cursor-pointer"
              />
              <span className="absolute -top-2 -right-2 bg-red-300 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cart?.orderItem?.length ?? 0}
              </span>
            </div>
          </Link>
        </div>


      </div>

    </div>
  )
}

export default Navbar