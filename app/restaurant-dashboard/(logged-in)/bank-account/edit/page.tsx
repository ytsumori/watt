"use client";

import {
  createRestaurantBankAccount,
  findBankAccountByRestaurantId,
  updateRestaurantBankAccount,
} from "@/actions/restaurant-bank-account";
import {
  Box,
  Card,
  Center,
  Heading,
  Progress,
  Spinner,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RestaurantIdContext } from "../../_components/restaurant-id-provider";
import {
  BankAccountForm,
  BankAccountFormData,
} from "../_components/bank-account-form";
import { RestaurantBankAccount } from "@prisma/client";
import { translateBankAccountType } from "@/lib/prisma/translate-enum";
import { getBank, getBranch } from "@/lib/bankcode-jp";

export default function NewBankAccount() {
  const router = useRouter();
  const toast = useToast();
  const restaurantId = useContext(RestaurantIdContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultBankAccount, setDefaultBankAccount] =
    useState<RestaurantBankAccount>();
  const [defaultBankName, setDefaultBankName] = useState<string>();
  const [defaultBranchName, setDefaultBranchName] = useState<string>();

  useEffect(() => {
    findBankAccountByRestaurantId(restaurantId).then((bankAccount) => {
      if (bankAccount) {
        setDefaultBankAccount(bankAccount);
        setIsLoading(false);
      } else {
        router.push("/restaurant-dashboard/bank-account/new");
      }
    });
  }, [restaurantId, router]);

  useEffect(() => {
    if (defaultBankAccount && defaultBankName === undefined) {
      getBank({ bankCode: defaultBankAccount.bankCode }).then((bank) => {
        if (bank.name === undefined) return;
        return setDefaultBankName(bank.name);
      });
    }
  }, [defaultBankAccount, defaultBankName]);

  useEffect(() => {
    if (defaultBankAccount && defaultBranchName === undefined) {
      setTimeout(() => {
        getBranch({
          bankCode: defaultBankAccount.bankCode,
          branchCode: defaultBankAccount.branchCode,
        }).then((result) => {
          if (result.branch === undefined) return;
          return setDefaultBranchName(result.branch.name);
        });
      }, 1000);
    }
  }, [defaultBankAccount, defaultBranchName]);

  const handleSubmit = (formData: BankAccountFormData) => {
    setIsSubmitting(true);
    updateRestaurantBankAccount({
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

  if (isLoading)
    return (
      <Center h="100vh" w="100vw">
        <VStack>
          <Spinner />
          <Text>口座情報を取得中</Text>
        </VStack>
      </Center>
    );

  return (
    <VStack h="100vh" w="100vw">
      {defaultBankAccount ? (
        <VStack w="full" spacing={2} alignItems="start" p={2} borderWidth="1px">
          <Heading size="md">現在の口座情報</Heading>
          <Box>
            <Heading size="sm">金融機関</Heading>
            <Text>
              {defaultBankName ?? ""}({defaultBankAccount.bankCode})
            </Text>
          </Box>
          <Box>
            <Heading size="sm">支店</Heading>
            <Text>
              {defaultBranchName ?? ""}({defaultBankAccount.branchCode})
            </Text>
          </Box>
          <Box>
            <Heading size="sm">口座種別</Heading>
            <Text>
              {translateBankAccountType(defaultBankAccount.accountType)}
            </Text>
          </Box>
          <Box>
            <Heading size="sm">口座番号</Heading>
            <Text>{defaultBankAccount.accountNo}</Text>
          </Box>
          <Box>
            <Heading size="sm">口座名義</Heading>
            <Text>{defaultBankAccount.holderName}</Text>
          </Box>
        </VStack>
      ) : (
        <Spinner />
      )}
      <BankAccountForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </VStack>
  );
}
