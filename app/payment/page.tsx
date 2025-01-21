"use client";

import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CompletePage from "@/components/CompletePage";
import CheckoutForm from "@/components/CheckoutForm";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const getStripe = () => {
  const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (!stripeKey) {
    console.log('PLease setup project')
    throw new Error(
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Please provide a valid publishable key in your environment variables.'
    );
  }

  return loadStripe(stripeKey);
};
const stripePromise = getStripe()

export default function StripeForm() {
  const [clientSecret, setClientSecret] = useState<any>("");
  const [confirmed, setConfirmed] = useState<any>(false);

  useEffect(() => {
    setConfirmed(new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    ));
  });

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const cartId = sessionStorage.getItem('cartId')
    fetch("/api/payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: [{ id: cartId}] }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, []);

  const options: StripeElementsOptions = {
    clientSecret: clientSecret, // Replace `any` with the appropriate type if needed
    appearance: {
      theme: "stripe", // Ensure this is one of the allowed values
    },
  };

  return (
    <div className="App">
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          {confirmed ? <CompletePage /> : <CheckoutForm />}
        </Elements>
      )}

    </div>
  );
}