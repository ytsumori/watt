"use client";

import React, { FormEventHandler, useEffect, useState } from "react";
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
import {
  decodeJWTToken,
  getAuthorizationUrl,
  validateAuthorization,
} from "@/lib/paypay";
import { getMyId } from "@/actions/me";
import { createPaypayCustomer } from "@/actions/paypay-customer";

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

  useEffect(() => {
    const responseToken = new URLSearchParams(window.location.search).get(
      "responseToken"
    );

    if (!responseToken) return;

    decodeJWTToken(responseToken).then((response) => {
      switch (response.result) {
        case "succeeded":
          createPaypayCustomer(response.userAuthorizationId).then(() => {
            onCompleteModalOpen();
          });
          break;
        case "declined":
          setMessage("paypayでの支払い設定に失敗しました。");
          break;
        default:
          setMessage("予期せぬエラーが発生しました。");
          break;
      }
    });
  }, [onCompleteModalOpen]);

  useEffect(() => {
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
          setMessage("決済情報を設定中");
          break;
        case "requires_payment_method":
          // Redirect your user back to your payment page to attempt collecting
          // payment again
          setMessage(
            "決済方法の登録に失敗しました。別の決済方法での登録を試してみてください。"
          );
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

    if (paymentMethodTypes === "external_paypay") {
      const userId = await getMyId();
      const authorizationUrl = await getAuthorizationUrl({
        userId: userId,
        redirectUrl: `${process.env.NEXT_PUBLIC_HOST_URL}${pathname}`,
      });
      router.push(authorizationUrl);
    }

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
