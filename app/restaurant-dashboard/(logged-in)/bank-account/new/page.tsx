"use client";

import { createRestaurantBankAccount } from "@/actions/restaurant-bank-account";
import { useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { RestaurantIdContext } from "../../_components/restaurant-id-provider";
import {
  BankAccountForm,
  BankAccountFormData,
} from "../_components/bank-account-form";

export default function NewBankAccount() {
  const router = useRouter();
  const toast = useToast();
  const restaurantId = useContext(RestaurantIdContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (formData: BankAccountFormData) => {
    setIsSubmitting(true);
    createRestaurantBankAccount({
      restaurantId,
      ...formData,
    })
      .then(() => {
        router.push("/restaurant-dashboard");
      })
      .catch(() => {
        setIsSubmitting(false);
        toast({
          title: "エラーが発生しました",
          status: "error",
        });
      });
  };

  return (
    <BankAccountForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
  );
}
