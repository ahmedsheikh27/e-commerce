"use client";

import { useState, useEffect, JSX } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";

const SuccessIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z"
      fill="white"
    />
  </svg>
);

const ErrorIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z"
      fill="white"
    />
  </svg>
);

const ProcessingIcon = (
  <svg
    width="24"
    height="24"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="8"
      cy="8"
      r="7"
      stroke="white"
      strokeWidth="2"
      strokeDasharray="44"
      strokeDashoffset="10"
    />
  </svg>
);


type PaymentStatus = 'succeeded' | 'processing' | 'requires_payment_method' ;

const STATUS_CONTENT_MAP: Record<PaymentStatus, { text: string; iconColor: string; icon: JSX.Element }> = {
  succeeded: {
    text: "Payment succeeded",
    iconColor: "bg-green-500",
    icon: SuccessIcon,
  },
  processing: {
    text: "Your payment is processing.",
    iconColor: "bg-gray-500",
    icon: ProcessingIcon,
  },
  requires_payment_method: {
    text: "Payment was not successful, please try again.",
    iconColor: "bg-red-500",
    icon: ErrorIcon,
  },
  // default: {
  //   text: "Something went wrong, please try again.",
  //   iconColor: "bg-red-500",
  //   icon: ProcessingIcon,
  // },
};

export default function CompletePage() {
  const stripe = useStripe();
  const router = useRouter();

  const [status, setStatus] = useState<PaymentStatus>("processing");
  const [intentId, setIntentId] = useState<string | null>(null);

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }: any) => {
      if (!paymentIntent) return;

      setStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
    });
  }, [stripe]);

  const handleContinueShopping = () => {
    sessionStorage.removeItem("cartId");
    router.push("/products");
  };
  const handleTryAgain = () => {
    router.push("/payment");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 text-center">
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${STATUS_CONTENT_MAP[status].iconColor}`}
        >
          {STATUS_CONTENT_MAP[status].icon}
        </div>
        <h2 className="text-lg font-semibold mb-2">{STATUS_CONTENT_MAP[status].text}</h2>
        {intentId && (
          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span className="font-medium">Payment ID:</span>
              <span>{intentId}</span>
            </div>
            <div className="flex justify-between mt-2">
              <span className="font-medium">Status:</span>
              <span>{status}</span>
            </div>
          </div>
        )}
        {/* {intentId && (
          <a
            href={`https://dashboard.stripe.com/payments/${intentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-blue-500 underline text-sm"
          >
            View details
          </a>
        )} */}
       {status === "succeeded" && (
          <button
            onClick={handleContinueShopping}
            className="px-6 py-2 text-white bg-green-500 rounded"
          >
            Continue Shopping
          </button>
        )}
        {(status === "requires_payment_method") && (
          <button
            onClick={handleTryAgain}
            className="px-6 py-2 text-white bg-red-500 rounded"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
