import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";


const STRIPE_SECRET_KEY='sk_test_51QjIDwHQRBycmse2464pGLC0IOR1rkamj41pDT7MlYgNzPg0f0wr5VNM6tuBrhG5thKP4QNIK0wHZBVf8drEWPj2003MjPxdcF'
const stripe = new Stripe(STRIPE_SECRET_KEY);

const calculateOrderAmount = (items: any) => {
  // Replace this with real calculation logic
  return 1500;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("Stripe secret key is not set.");
    }

    const { items } = await req.json(); // Parse JSON request body

    const paymentIntent = await stripe.paymentIntents.create({
      amount: calculateOrderAmount(items),
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error: any) {
    console.error("Error creating payment intent:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
