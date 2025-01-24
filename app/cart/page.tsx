'use client'
import React, {  useEffect, useState } from "react";
import Link from "next/link";
import CartItems from "@/components/CartItems";
import { useCartContext } from "@/context/CartContext";

function Cart() {
 const {  loading,error,cart} = useCartContext()


  if (loading) return <p>Loading....</p>;
  if (error) return <p className="text-red-500">Cart Error: {error.message}</p>;

  if (!cart || !cart.orderItem || cart.orderItem.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <p className="text-lg font-medium text-gray-700 mb-4">Your cart is empty</p>
        <Link 
          href="/products" 
          className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const subTotal = cart.orderItem.reduce(
    (total:number, item:any) => total + item.orderItemProduct.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cart.orderItem.map((item:any, index:number) => (
          <CartItems 
            key={index} 
            item={item}
          />
        ))}
      </div>
      
      <div className="flex flex-col items-end mb-3 mt-6">
        <span className="text-gray-700">Subtotal</span>
        <span className="text-xl font-bold text-indigo-600">
          ${subTotal.toFixed(2)}
        </span>
      </div>
      
      <div className="flex justify-end mt-4 space-x-4">
        <Link 
          href="/products" 
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Continue Shopping
        </Link>
        <Link 
          href="/payment" 
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Checkout
        </Link>
      </div>
    </div>
  );
}

export default Cart;