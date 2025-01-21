'use client';

import { removeOrderItem, updateOrderItem } from '@/lib/hygraph';
import { turborepoTraceAccess } from 'next/dist/build/turborepo-access-trace';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Loader from './loader/Loader';


const CartItems = ({ item }: any) => {

  const router = useRouter()

  const [quantity, setQuantity] = useState<number>(item.quantity);
  const [removing, setRemoving] = useState<any>(false);
  const [loading, setLoading] = useState<boolean>(true)

  const id = item.id;

  const handleIncrement = async () => {
    const newQuantity = quantity + 1;

    try {
      await updateOrderItem({ id, quantity: newQuantity });
      setQuantity(newQuantity);
      setLoading(false)
    } catch (error) {
      console.error("Failed to increment quantity:", error);
    }
  };

  const handleDecrement = async () => {
    if (quantity <= 1) return;
    const newQuantity = quantity - 1;

    try {
      await updateOrderItem({ id, quantity: newQuantity });
      setQuantity(newQuantity);
      setLoading(false)
    } catch (error) {
      console.error("Failed to decrement quantity:", error);
    }
  };


  const handleRemove = async () => {
    // if (!confirm('Are you sure you want to remove this item from the cart?')) return;

    setRemoving(true);
    try {
      await removeOrderItem(id);
      router.refresh()
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemoving(false);
    }
  };

  // if (loading) {
  //   return <Loader />
  // }


  return (
    <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-md mb-4 m-5">
      {/* Product Image */}
      <div className="flex-shrink-0 h-16 w-16 md:h-20 md:w-20 rounded-lg bg-gray-100 p-1 mr-4">
        <img
          loading="lazy"
          src={item.orderItemProduct.productImage.url}
          alt={item.orderItemProduct.name}
          className="h-full w-full object-contain rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow">
        <p className="block text-gray-800 font-medium text-sm md:text-base hover:underline">
          {item.orderItemProduct.name}
        </p>
        <button className="flex items-center mt-2 text-gray-400 text-xs hover:text-indigo-600 focus:outline-none"
          onClick={handleRemove}
          disabled={removing}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 mr-1"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          {removing ? 'Removing...' : 'Remove'}
        </button>
      </div>

      {/* Quantity Control */}
      <div className="flex flex-col items-center ml-auto mr-4">
        {/* Decrement Button */}
        <button
          className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
          onClick={handleDecrement}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Quantity Display */}
        <span className="mx-3 text-gray-800 font-medium">{quantity}</span>

        {/* Increment Button */}
        <button
          className="text-gray-400 hover:text-indigo-600 focus:outline-none p-1"
          onClick={handleIncrement}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4"
          >
            <path
              clipRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              fillRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Product Price */}
      <div className="text-right">
        <p className="text-gray-800 font-medium">
          ${item.orderItemProduct.price * item.quantity}
        </p>
        <p className="text-gray-500 text-sm">
          ${item.orderItemProduct.price} each
        </p>
      </div>
    </div>
  );
};

export default CartItems;
