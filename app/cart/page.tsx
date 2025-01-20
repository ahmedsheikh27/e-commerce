'use client'
import React, { useEffect, useState } from "react";
import { fetchCartById } from "@/lib/hygraph";
import Link from "next/link";
import CartItems from "@/components/CartItems";
import { useRouter } from "next/navigation";

function Cart() {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any>(null);

const router = useRouter()

  useEffect(() => {
    async function getCart() {
      const cartId = sessionStorage.getItem("cartId");
      if (!cartId) {
        console.log('NO cart Id found')
        return
      }
      try {
        const fetchedCart: any = await fetchCartById(cartId);
        setCart(fetchedCart);
        console.log("Cart fetched successfully:", fetchedCart);
      } catch (error) {
        console.error("Error fetching cart:", error);
        setError(error)
      } finally {
        setLoading(false);
      }
    }
    getCart();
  }, []);

  if (!cart || !cart.orderItem || cart.orderItem.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center py-10">
            <p className="text-lg font-medium text-gray-700 mb-4">No items in the cart.</p>
            <button
                onClick={() => router.push('/products')}
                className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700"
            >
                Go Shopping
            </button>
        </div>
    );
}

  if (error) return <p className="text-red-500">{error}</p>


  if (loading) {
    return <p>Loading...</p>;
  }


  return (

    <div>
      <h1>Your Cart</h1>
      <div>
        {cart.orderItem.map((item: any, index: number) => (
          <CartItems key={index} item={item} />
        ))}
      </div>
      {/* Total Price */}
      <div className="flex flex-col items-end mb-3 mr-5">
        <span className="text-gray-700">Sub total</span>
        <span className="text-xl font-bold text-indigo-600">
          $
          {cart.orderItem.reduce(
            (total: number, item: any) =>
              total + item.orderItemProduct.price * item.quantity,
            0
          )}
        </span>
      </div>
      <div className="flex justify-end mt-4">
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md mr-4 hover:bg-gray-300">
          <Link href='/products'>
            Continue Shopping
          </Link>
        </button>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-md mr-4 hover:bg-indigo-700">
          <Link href='/checkout'>
            Checkout
          </Link>
        </button>
      </div>
      {/* <CheckoutPage cart={cart}/> */}
    </div>
  );
}

export default Cart;
