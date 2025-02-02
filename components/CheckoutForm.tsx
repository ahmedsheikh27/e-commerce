"use client";

import { useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { createOrder, fetchCartById } from "@/lib/hygraph";
import convertToSubcurrency from "@/lib/convertToSubcurrency";

export default function CheckoutForm({ amount }: { amount: any }) {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [cart, setCart] = useState<any>(null);
    const [email, setEmail] = useState<string>(""); // Email input state
    const [successMessage, setSuccessMessage] = useState<string>(""); // Success message state
    const [clientSecret, setClientSecret] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the cart details from Hygraph
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

    useEffect(() => {
        // Create payment intent when the component mounts
        async function createPaymentIntent() {
            try {
                const response = await fetch("/api/payment", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
                });
                const data = await response.json();
                setClientSecret(data.clientSecret);
            } catch (error) {
                console.error("Error creating payment intent:", error);
            }
        }
        createPaymentIntent();
    }, [amount]);

    const calculateTotalPrice = () => {
        if (!cart || !cart.orderItem) return 0;
        return cart.orderItem.reduce(
            (total: number, item: any) =>
                total + item.orderItemProduct.price * item.quantity,
            0
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if (!email) {
            alert("Please enter an email address.");
            return;
        }

        setIsLoading(true);

        // Submit Stripe Elements data first
        const { error: submitError } = await elements.submit();

        if (submitError) {
            setMessage(submitError.message || "An error occurred during submission.");
            setIsLoading(false);
            return;
        }

        // Confirm the payment
        const { error, paymentIntent }: any = await stripe.confirmPayment({
            elements,
            clientSecret: clientSecret!,
            confirmParams: {
                return_url: process.env.NEXT_PUBLIC_BSE_URL || "http://e-commerce-lake-one-57.vercel.app",
            },
        });

        if (error) {
            setMessage(
                error.type === "card_error" || error.type === "validation_error"
                    ? error.message
                    : "An unexpected error occurred."
            );
            setIsLoading(false);
            return;
        }

        // If the payment is successful
        if (paymentIntent && paymentIntent.status === "succeeded") {
            const cartId = sessionStorage.getItem("cartId");
            const totalPrice = calculateTotalPrice();

            try {
                const orderedCart = await createOrder({ cartId, email, totalPrice });
                console.log("Order created successfully:", orderedCart);
                setSuccessMessage("Order successfully created! Redirecting...");
                alert("Order successfully created! Redirecting...");
            } catch (err: any) {
                console.error("Error creating order:", err.message);
                setMessage("An error occurred while creating the order.");
            }
        } else {
            setMessage("Payment was not successful. Please try again.");
        }

        setIsLoading(false);
    };


    if (successMessage) {
        return (
            <div className="flex flex-col items-center justify-center py-10">
                <p className="text-lg font-medium text-green-600">{successMessage}</p>
            </div>
        );
    }

    if (!clientSecret || !stripe || !elements) {
        return (
            <div className="flex items-center justify-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent text-surface dark:text-white">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-4xl mx-auto shadow-lg rounded-lg">
                <div className="flex flex-col lg:flex-row">
                    {/* Left Section: Product Summary */}
                    <div className="lg:w-3/5 w-full p-4 bg-gray-100 rounded-md">
                        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                        {cart?.orderItem?.map((item: any, index: number) => (
                            <div
                                className="flex items-center justify-between mb-6 pb-4 border-b"
                                key={index}
                            >
                                <img
                                    src={item.orderItemProduct.productImage.url}
                                    alt={item.orderItemProduct.name}
                                    className="w-12 h-12 object-cover rounded "
                                />
                                <div className="flex-1 ml-2 sm:ml-4">
                                    <p className="text-sm font-medium truncate max-w-[200px]">
                                        {item.orderItemProduct.name}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate max-w-[200px] sm:block hidden">
                                        {item.orderItemProduct.description}
                                    </p>
                                    <p className="text-sm text-black">Qty: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">${item.orderItemProduct.price}</p>
                                    <p className="text-sm text-gray-500 sm:block hidden">
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
                    <div className="lg:w-2/5 w-full p-4">
                        <form onSubmit={handleSubmit} className="bg-white rounded-md">
                            <div className="space-y-4">
                                <div>
                                    <label
                                        className="block text-sm font-medium text-gray-700 mb-1"
                                        htmlFor="email"
                                    >
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                {clientSecret && <PaymentElement />}

                                {message && <div className="text-red-500">{message}</div>}

                                <button
                                    disabled={!stripe || isLoading}
                                    className="text-white w-full p-3 bg-black rounded-md font-bold disabled:opacity-50"
                                >
                                    {!isLoading ? `Pay $${amount}` : "Processing..."}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
