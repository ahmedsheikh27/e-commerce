"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CompletePage from "@/components/CompletePage";
import CheckoutForm from "@/components/CheckoutForm";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { fetchCartById } from "@/lib/hygraph";
import { useRouter } from "next/navigation";

const getStripe = () => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    throw new Error(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Please provide a valid key."
    );
  }

  return loadStripe(stripeKey);
};
const stripePromise = getStripe();

export default function StripeForm() {
  const [amount, setAmount] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const router = useRouter()

  useEffect(() => {
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );
    setConfirmed(Boolean(clientSecret));
  }, []);

  // Function to calculate total price
  const calculateTotalAmount = async () => {
    const cartId = sessionStorage.getItem("cartId");
    if (!cartId) {
      console.error("No cart ID found in session storage.");
      setLoading(false);
      return;
    }

    try {
      const fetchedCart = await fetchCartById(cartId);
      if (!fetchedCart || !fetchedCart.orderItem) {
        console.error("Invalid cart data.");
        setLoading(false);
        return;
      }

      // Calculate total price
      const totalPrice = fetchedCart.orderItem.reduce(
        (total: number, item: any) =>
          total + item.orderItemProduct.price * item.quantity,
        0
      );
      setAmount(totalPrice);
    } catch (error) {
      console.error("Error fetching cart or calculating total price:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, []);

  const handleTryAgain = () => {
    router.push("/payment");
  };

  return (
    <div className="App">
      {amount !== null ? (
        <Elements
          stripe={stripePromise}
          options={{
            mode: "payment",
            amount: convertToSubcurrency(amount),
            currency: "usd",
          }}
        >
          {confirmed ? <CompletePage /> : <CheckoutForm amount={amount} />}
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md space-y-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m0-4h.01M12 18.354l-.354-.354m0 0a9 9 0 1110.708-10.708 9 9 0 01-10.708 10.708z"
            />
          </svg>
          <h2 className="text-lg font-semibold text-gray-800">Something Went Wrong</h2>
          <p className="text-gray-500">
            An error occurred while processing your request. Please try again later.
          <button
            onClick={handleTryAgain}
            className="px-6 py-2 text-white bg-red-500 rounded"
          >
            Try Again
          </button>
          </p>
        </div>

      )}
    </div>
  );
}