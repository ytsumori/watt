"use client";

import React, { FormEventHandler, useEffect, useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
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
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function SetupForm() {
  const stripe = useStripe();
  const elements = useElements();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const redirectPathname = searchParams.get("redirect_pathname");

  const [message, setMessage] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { isOpen: isCompleteModalOpen, onOpen: onCompleteModalOpen, onClose: onCompleteModalClose } = useDisclosure();

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get("setup_intent_client_secret");

    if (!clientSecret) return;

    stripe.retrieveSetupIntent(clientSecret).then(({ setupIntent }) => {
      if (!setupIntent) return setMessage("Something went wrong.");
      switch (setupIntent.status) {
        case "succeeded":
          onCompleteModalOpen();
          break;
        case "processing":
          setMessage("決済情報を設定中");
          break;
        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage("決済方法の登録に失敗しました。別の決済方法での登録を試してみてください。");
          break;
        default:
          setMessage("予期せぬエラーが発生しました。");
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

    setIsSubmitting(true);

    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: `${process.env.NEXT_PUBLIC_HOST_URL}${pathname}${
          redirectPathname ? `?redirect_pathname=${redirectPathname}` : ""
        }`,
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
      <PaymentElement />
      <Button type="submit" size="md" disabled={isSubmitting || !stripe || !elements} mt={4} isLoading={isSubmitting}>
        登録
      </Button>
      {message && <div id="payment-message">{message}</div>}
      <Modal isCentered isOpen={isCompleteModalOpen} onClose={onCompleteModalClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>支払い方法の登録が完了しました</ModalHeader>
          <ModalBody textAlign="center">
            <Button as={Link} href={redirectPathname ?? "/payment-methods"}>
              元のページに戻る
            </Button>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </form>
  );
}
