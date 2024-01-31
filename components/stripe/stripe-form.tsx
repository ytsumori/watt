"use client";

import React, { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import SetupForm from "./setup-form";
import { Box } from "@chakra-ui/react";
import { createSetupIntent } from "@/lib/stripe/setup-intent";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function StripeForm() {
  const [clientSecret, setClientSecret] = React.useState<string>();

  useEffect(() => {
    createSetupIntent().then((client_secret) =>
      setClientSecret(client_secret ?? undefined)
    );
  }, []);

  return (
    <Box mt={4}>
      {clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            // @ts-ignore
            externalPaymentMethodTypes: ["external_paypay"],
            currency: "jpy",
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          <SetupForm />
        </Elements>
      )}
    </Box>
  );
}
