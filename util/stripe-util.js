import { loadStripe } from "@stripe/stripe-js";

let stripePromise;

//https://stripe.com/docs/stripe-js/react#elements-props-stripe
export const getStripe = () => {
  if (!stripePromise) {
    // stripe will be loading asynchronously
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);
  }
  return stripePromise;
};
