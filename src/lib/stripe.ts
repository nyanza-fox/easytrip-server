import Stripe from "stripe";
const key = process.env.STRIPE_SECRET_KEY || " ";
const stripe: Stripe = new Stripe(key, {
  apiVersion: "2024-04-10",
});
export default stripe;
