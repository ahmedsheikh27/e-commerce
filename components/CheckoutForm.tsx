"use client";

import { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { createOrder, fetchCartById } from "@/lib/hygraph";

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cart, setCart] = useState<any>(null);
    const [email, setEmail] = useState<string>(""); // Email input state
    const [error, setError] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState<string>(""); // Success message state

    const router = useRouter();

    useEffect(() => {
        async function getCart() {
            const cartId = sessionStorage.getItem("cartId");
            try {
                const fetchedCart = await fetchCartById(cartId);
                setCart(fetchedCart);
                console.log("Cart fetched successfully:", fetchedCart);
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        }
        getCart();
    }, []);

    const calculateTotalPrice = () => {
        if (!cart || !cart.orderItem) return 0;
        return cart.orderItem.reduce(
            (total: number, item: any) =>
                total + item.orderItemProduct.price * item.quantity,
            0
        );
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return; // Prevent submission if Stripe.js is not ready
        }

        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        setIsLoading(true);

        // Confirm the payment using Stripe
        const { error, PaymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: "http://localhost:3000/payment",
            },
        });

        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setMessage(error.message);
            } else {
                setMessage("An unexpected error occurred.");
            }
            setIsLoading(false);
            return;
        }

        // Check if the payment succeeded
        if (PaymentIntent && PaymentIntent.status === "succeeded") {
            const cartId = sessionStorage.getItem("cartId");
            const totalPrice = calculateTotalPrice();

            try {
                // Create the order after successful payment
                const orderedCart = await createOrder({ cartId, email, totalPrice });
                console.log("Order created successfully:", orderedCart);
                setSuccessMessage("Order successfully created! Redirecting to products page...");
                alert(successMessage)
            } catch (err: any) {
                console.error("Error creating order:", err.message);
                setError(err.message || "An error occurred while creating the order.");
            }
        } else {
            setMessage("Payment was not successful. Please try again.");
        }

        setIsLoading(false);
    };

    const paymentElementOptions = {
        layout: "accordion",
    };

    if (error) return <p className="text-red-500">{error}</p>;

    if (successMessage) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <p className="text-lg font-medium text-green-600">{successMessage}</p>

            </div>
        );
    }

    if (!cart) return <p>Loading cart details...</p>;

    return (
        <div className="ml-[100px] mt-[50px] mb-10 mr-[100px] shadow-lg rounded-lg">

            <div className="flex flex-col lg:flex-row ">
                {/* Left Section: Product Summary */}
                <div className="lg:w-3/5 w-full p-4 bg-gray-100 rounded-md">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    {cart.orderItem.map((item: any, index: number) => (
                        <div
                            className="flex items-center justify-between mb-6 pb-4 border-b"
                            key={index}
                        >
                            <img
                                src={item.orderItemProduct.productImage.url}
                                alt={item.orderItemProduct.name}
                                className="w-12 h-12 object-cover rounded"
                            />
                            <div className="flex-1 ml-4">
                                <p className="text-sm font-medium">{item.orderItemProduct.name}</p>
                                <p className="text-sm text-gray-500 truncate">
                                    {item.orderItemProduct.description}
                                </p>
                                <p className="text-sm text-black">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold">
                                    ${item.orderItemProduct.price}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ${item.orderItemProduct.price} each
                                </p>
                            </div>
                        </div>
                    ))}
                    <div className="flex justify-between font-medium text-lg mt-6">
                        <span>Total:</span>
                        <span>${calculateTotalPrice()}</span>
                    </div>
                </div>

                {/* Right Section: Payment Form */}
                <form
                    id="payment-form"
                    onSubmit={handleSubmit}
                    className="flex-1 p-4 bg-white rounded-md shadow-lg"
                >
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 mb-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <PaymentElement
                        id="payment-element"
                        options={paymentElementOptions}
                    />
                    <button
                        disabled={isLoading || !stripe || !elements}
                        id="submit"
                        className="w-full py-3 px-4 mt-4 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700"
                    >
                        <span id="button-text">
                            {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                        </span>
                    </button>
                    {message && <div id="payment-message" className="mt-2 text-red-500">{message}</div>}
                </form>
            </div>
        </div>
    );
}
