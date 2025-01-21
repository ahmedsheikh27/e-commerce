"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CompletePage from "@/components/CompletePage";
import CheckoutForm from "@/components/CheckoutForm";
import ProductPage from "./products/page";


// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function StripeForm() {


  return (
    <div className="App">
      <ProductPage/>
    </div>
  );
}