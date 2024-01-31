"use client";

import React, { FormEventHandler, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const [message, setMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const [paymentMethodTypes, setPaymentMethodTypes] = useState<string>();

  React.useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "setup_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      if (!setupIntent) return setMessage("Something went wrong.");
      switch (setupIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
      // @ts-ignore
      console.log(setupIntent.customer);
    });
  }, [stripe]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    if (paymentMethodTypes === "external_paypay") {
      router.push("https://developer.paypay.ne.jp/products/docs/nativepayment");
    }

    setIsLoading(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
      },
    });

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message);
      } else {
        setMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
      <PaymentElement onChange={(e) => setPaymentMethodTypes(e.value.type)} />
      <Button
        type="submit"
        size="md"
        color="white"
        disabled={isLoading || !stripe || !elements}
        mt={4}
        isLoading={isLoading}
      >
        登録
      </Button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
