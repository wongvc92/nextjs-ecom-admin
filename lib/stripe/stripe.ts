import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("Stripe Secret Key is not set");
}

export const stripe = new Stripe(stripeSecretKey, {
  typescript: true,
  apiVersion: "2024-06-20",
});
