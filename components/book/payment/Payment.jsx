import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "../../../util/stripe-util";
import CheckoutForm from "./CheckoutForm";

// this will import their js
// https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe
// https://github.com/stripe/react-stripe-js/blob/master/docs/migrating.md
const stripePromise = getStripe();

class Payment extends React.Component {
  render() {
    return (
      <div className="payment">
        <Elements stripe={stripePromise}>
          <CheckoutForm {...this.props} />
        </Elements>
      </div>
    );
  }
}

export default Payment;
