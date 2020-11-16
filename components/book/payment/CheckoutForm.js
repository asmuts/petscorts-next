import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

import {
  createOptions,
  formStyles,
  buttonStyles,
  paragraphStyle,
} from "./styles";

const CheckoutForm = (props) => {
  const stripe = useStripe();
  const elements = useElements();

  let [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    const { storePaymentToken } = props;
    e.preventDefault();

    const cardElement = elements.getElement(CardElement);

    if (stripe) {
      try {
        // e.g. createToken - https://stripe.com/docs/js/tokens_sources/create_token?type=cardElement
        const result = await stripe.createToken(cardElement);
        if (result && result.error) {
          throw new Error(result.error.message);
        }
        setError(null);
        // pass the full token
        storePaymentToken(result.token);
      } catch (error) {
        setError(error.message);
      }
    } else {
      console.error("Stripe.js hasn't loaded yet!");
    }
  };

  //////////////////////////////////////////////
  // JSX

  return (
    <form {...formStyles()} onSubmit={handleSubmit}>
      <CardElement {...createOptions()} />
      <p {...paragraphStyle()}>
        *You will be not charged until the owner confirms.
      </p>
      <p {...paragraphStyle()}>
        (test card# 4242424242424242, any future exp., any cvc)
      </p>

      {error && <div className="alert alert-danger alert-payment">{error}</div>}

      <button {...buttonStyles()} className="btn btn-success">
        Confirm Payment
      </button>
    </form>
  );
};

export default CheckoutForm;
