// 'use client';

// import { createOrder, fetchCartById } from '@/lib/hygraph';
// import { useRouter } from 'next/navigation';
// import React, { useEffect, useState } from 'react';

// const CheckOut = () => {
//     const [cart, setCart] = useState<any>(null);
//     const [order, setOrder] = useState<any>(null);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [email, setEmail] = useState<string>(''); // To store user email
//     const [error, setError] = useState<any>(null);
//     const [successMessage, setSuccessMessage] = useState<string>(''); // Success message state

//     const router = useRouter();

//     useEffect(() => {
//         async function getCart() {
//             const cartId = sessionStorage.getItem('cartId');
//             try {
//                 const fetchedCart = await fetchCartById(cartId);
//                 setCart(fetchedCart);
//                 console.log('Cart fetched successfully:', fetchedCart);
//             } catch (error) {
//                 console.error('Error fetching cart:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         getCart();
//     }, []);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setEmail(e.target.value);
//     };

//     const calculateTotalPrice = () => {
//         if (!cart || !cart.orderItem) return 0;
//         return cart.orderItem.reduce(
//             (total: number, item: any) =>
//                 total + item.orderItemProduct.price * item.quantity,
//             0
//         );
//     };

//     const handleSubmit = async () => {
//         if (!email) {
//             alert('Please enter an email');
//             return;
//         }

//         const cartId = sessionStorage.getItem('cartId');
//         const totalPrice = calculateTotalPrice();

//         try {
//             // Create order
//             const orderedCart = await createOrder({ cartId, email, totalPrice });
//             setOrder(orderedCart);
//             console.log('Order completed', orderedCart)

//             // Remove cartId from session storage
//             sessionStorage.removeItem('cartId');

//             // Set success message
//             setSuccessMessage('Order successfully created! Redirecting to products page...');

//             // Navigate to products page after a short delay
//             setTimeout(() => {
//                 router.push('/products');
//             }, 3000);
//         } catch (err: any) {
//             console.error('Error creating order:', err.message);
//             setError(err.message || 'An error occurred while creating the order.');
//         }
//     };

//     if (error) return <p className="text-red-500">{error}</p>;

//     if (successMessage) {
//         return (
//             <div className="flex flex-col items-center justify-center py-10">
//                 <p className="text-lg font-medium text-green-600">{successMessage}</p>
//                 <button
//                     onClick={() => router.push('/products')}
//                     className="px-6 py-3 bg-blue-600 text-white rounded-md text-lg font-medium hover:bg-blue-700">
//                     Go Shopping
//                 </button>
//             </div>
//         );
//     }
//     if (loading) return <p>Loading cart details...</p>;




//     return (
//         <div className="flex flex-col lg:flex-row w-11/12 max-w-6xl mx-auto my-10 border rounded-lg shadow-lg overflow-hidden">
//             {/* Left Section: Order Summary */}
//             <div className="flex-1 p-6 bg-gray-100">
//                 <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
//                 {cart.orderItem.map((item: any, index: number) => (
//                     <div className="flex items-center justify-between mb-6 pb-4 border-b" key={index}>
//                         <img
//                             src={item.orderItemProduct.productImage.url}
//                             alt={item.orderItemProduct.name}
//                             className="w-16 h-16 object-cover rounded"
//                         />
//                         <div className="flex-1 ml-4">
//                             <p className="text-sm font-medium">{item.orderItemProduct.name}</p>
//                             <p className="text-sm text-gray-500">{item.orderItemProduct.description}</p>
//                             <p className="text-sm text-black">Qty: {item.quantity}</p>
//                         </div>
//                         <div className="flex flex-col gap-5">
//                             <p className="text-sm font-bold">${item.orderItemProduct.price}</p>
//                             <p className="text-sm text-gray-500">${item.orderItemProduct.price} each</p>
//                         </div>
//                     </div>
//                 ))}
//                 <div className="flex justify-between font-medium text-lg mt-6">
//                     <span>Total:</span>
//                     <span>${calculateTotalPrice()}</span>
//                 </div>
//             </div>

//             {/* Right Section: Payment Form */}
//             <div className="flex-1 p-6 bg-white">
//                 <h2 className="text-lg font-semibold mb-6">Payment Information</h2>
//                 <form
//                     className="space-y-4"
//                     onSubmit={(e) => {
//                         e.preventDefault();
//                         handleSubmit();
//                     }}
//                 >
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
//                             Email
//                         </label>
//                         <input
//                             type="email"
//                             id="email"
//                             value={email}
//                             onChange={handleChange}
//                             className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             placeholder="Enter your email"
//                             required
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full py-3 px-4 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700"
//                     >
//                         Pay Now
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default CheckOut;