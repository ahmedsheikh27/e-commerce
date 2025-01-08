// 'use client'
// import { createCart } from '@/lib/hygraph'
// import React, { use, useEffect, useState } from 'react'
// import ProductDetails from '../products/[id]/page'

// const CartPage = () => {


// const [cart, setCart] = useState([])
// const [total, setTotal] = useState(0)
// const [loading, setLoading] = useState(true)
// const [error, setError] = useState(null)
// const [quantity, setQuantity] = useState(Number(''))
// // const [cartId, setCartId] = useState(null)


// const fetchCart = async () => { 
//   try {
//     const data = await  createCart()
//     setCart(data.cart)
//     setTotal(data.total)
//     setLoading(false)
//   } catch (error) {
//     setError(error)
//     setLoading(false)
//   }
// }
// useEffect(() => { 
//   fetchCart()
// }, [])

// if (error) return <p>Error: {error}</p>;
// if (!product) return <p>Loading...</p>;

// // const handleAdd = async (productId, price) => {
// //   try {
// //     await createCart(productId, price, quantity)
// //     fetchCart()
// //   } catch (error) {
// //     setError(error)
// //   }
// // }
// // const handleRemove = async (productId) => { 
// //   try {
// //     await removeProduct(productId)
// //     fetchCart()
// //   } catch (error) {
// //     setError(error)
// //   }
// // }

// // const handleQuantityChange = (e) => { 
// //   setQuantity(e.target.value)
// // }
// // const handleCheckout = async () => {  
// //   try {
// //     await checkoutCart()
// //     fetchCart()
// //   } catch (error) {
// //     setError(error)
// //   }
// // }
// // const handleClearCart = async () => { 
// //   try {
// //     await clearCart()
// //     fetchCart()
// //   } catch (error) {
// //     setError(error)
// //   }
// // }
// // const handleCreateCart = async () => {
// //   try {
// //     await createCart()
// //     fetchCart()
// //   } catch (error) {
// //     setError(error)
// //   }
// // }
// // useEffect(() => {      
// //   fetchCart()

// // }, [])
// // if (loading) return <p>Loading...</p>
// // if (error) return <p>{error}</p>
// // return (
// //   <div>
// //     <h1>Cart</h1>
// //     <div>
// //       {cart.map((item) => (
// //         <div key={item.id}>
// //           <div>{item.name}</div>
// //           <div>{item.price}</div>
// //           <div>{item.quantity}</div>
// //           <button onClick={() => handleRemove(item.id)}>Remove</button>
// //         </div>
// //       ))}
// //     </div>

// //     <div>
// //       <div>Total: {total}</div>
// //       <button onClick={handleCheckout}>Checkout</button>
// //       <button onClick={handleClearCart}>Clear Cart</button>
// //     </div>
// //   </div>
// // )
// // }
// // export default CartPage
// // import React, { useState } from 'react'
// // import { createCart } from '@/lib/hygraph'
// // const CartPage = () => {




//   // const [cart, setCart] = useState([])

//   // const cart = [
//   //   {
//   //     id: 1,
//   //     name: 'Product 1',
//   //     price: 100,
//   //     quantity: 1
//   //   },
//   //   {
//   //     id: 2,
//   //     name: 'Product 2',
//   //     price: 200,
//   //     quantity: 2
//   //   }
//   // ]
//   //  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
//   // const handleRemove = (id) => { }

//   return (
//     <div>
//       {cart.map((item:any) => (
//        <ProductDetails key={item.id} cartProduct={item} />
//       ))}
//     </div>
//   )
// }

// export default CartPage