// // /lib/createPaymentIntent.ts

// export const createPaymentIntent = async (cart: any) => {
//     const cartId = cart.id // Get the cartId from sessionStorage
  
//     if (!cartId) {
//       console.error('Cart ID is missing');
//       return;
//     }
  
//     try {
//       const response = await fetch('/api/payment', { // Replace with your actual API route
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ cartId }), // Send the cartId in the request body
//       });
  
//       const data = await response.json();
//       if (data.clientSecret) {
//         // Use clientSecret for Stripe payment processing
//         console.log('Client Secret:', data.clientSecret);
//       } else {
//         console.error('Error creating payment intent:', data.error);
//       }
//     } catch (error) {
//       console.error('Error with payment intent request:', error);
//     }
//   };
  