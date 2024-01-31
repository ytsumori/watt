"use client";

import React, { FormEventHandler, useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

export default function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const pathname = usePathname();

  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    isOpen: isCompleteModalOpen,
    onOpen: onCompleteModalOpen,
    onClose: onCompleteModalClose,
  } = useDisclosure();

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
          onCompleteModalOpen();
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe, onCompleteModalOpen]);

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

    setIsSubmitting(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_HOST_URL}${pathname}`,
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

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
      <PaymentElement onChange={(e) => setPaymentMethodTypes(e.value.type)} />
      <Button
        type="submit"
        size="md"
        color="white"
        disabled={isSubmitting || !stripe || !elements}
        mt={4}
        isLoading={isSubmitting}
      >
        登録
      </Button>
      {message && <div id="payment-message">{message}</div>}
      <Modal
        isOpen={isCompleteModalOpen}
        onClose={onCompleteModalClose}
        size="sm"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>支払い方法の登録が完了しました</ModalHeader>
          <ModalBody textAlign="center">
            <Button color="white" onClick={() => router.push("/")}>
              トップページに戻る
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </form>
  );
}
