'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { addToCart, createCart, fetchProductByID } from '@/lib/hygraph';
import { FaArrowLeft } from 'react-icons/fa';

export default function ProductDetails() {
  const router = useRouter();
  const { id } = useParams();
  console.log("Route Parameter ID:", id);

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<any>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);
  const [cart, setCart] = useState<any>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await fetchProductByID(id);
        setProduct(productData);
      } catch (err) {
        setError(err);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);
  useEffect(() => {
    if (cart?.id) {
      sessionStorage.setItem('cartId', cart.id);
    }
  }, [cart?.id]);


  const handleAddToCart = async () => {
    setLoading(true);
    setError(null);
    const cartId = sessionStorage.getItem('cartId') || cart?.id;

    try {
      if (!cartId) {
        // Create a new cart
        const variables = {
          productId: product.id,
          quantity: parseInt(quantity, 10),
          price: product.price,
          totalPrice: product.price * quantity,
        };
        console.log("Creating new cart with variables:", variables);
        const newCart = await createCart(variables);
        setCart(newCart);
      } else {
        // Update the existing cart
        const variables = {
          cartId:cartId,
          productId: product.id,
          quantity: parseInt(quantity, 10),
          price: product.price, 
          totalPrice: cart?.totalPrice + (product.price * quantity) || product.price * quantity,
        };
        console.log("Updating cart with variables:", variables);
        const updatedCart = await addToCart(variables);
        setCart(updatedCart);
      }
    } catch (err) {
      console.error("ApolloError details:", err);
      setError('Failed to handle cart operation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!id) {
    return <p>Product ID is missing. Please check the URL.</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!product) {
    return <p>Loading product data...</p>;
  }

  // const totalPrice = (product.price * quantity).toFixed(2); 

  return (
    <div className="container mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      {/* Back Arrow */}
      <div className="mb-4">
        <FaArrowLeft
          size={30}
          className="text-gray-500 group-hover:text-black cursor-pointer transition"
          onClick={() => router.push('/products')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Image */}
        <div className="flex justify-center items-center">
          <img
            src={product.productImage?.url}
            alt={product.name}
            className="w-full h-auto max-w-sm rounded-lg shadow-md"
          />
        </div>

        {/* Product Details */}
        <div>
          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-6 text-gray-600">{product.description}</p>
          <p className="text-2xl font-semibold text-green-600 mt-4">
            ${(product.price * quantity).toFixed(2)}
          </p>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4 mt-6">
            <label htmlFor="quantity" className="text-gray-700 font-medium">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              name='quantity'
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-16 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={loading}
            className={`mt-6 py-2 px-6 rounded-full transition ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}