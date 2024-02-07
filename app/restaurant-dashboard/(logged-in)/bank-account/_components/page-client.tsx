"use client";

import { createRestaurantBankAccount } from "@/actions/restaurant-bank-account";
import {
  BackcodeSearchResult,
  searchBanks,
  searchBranches,
} from "@/lib/bankcode-jp";
import { translateBankAccountType } from "@/lib/prisma/translate-enum";
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { BankAccountType } from "@prisma/client";
import { useContext, useState } from "react";
import { RestaurantIdContext } from "../../_components/restaurant-id-provider";
import { useRouter } from "next/navigation";

export function BankAccountPage() {
  const router = useRouter();
  const toast = useToast();
  const restaurantId = useContext(RestaurantIdContext);
  const [bankSearchText, setBankSearchText] = useState<string>();
  const [bankOptions, setBankOptions] = useState<BackcodeSearchResult[]>([]);
  const [bankCode, setBankCode] = useState<string>();
  const [branchOptions, setBranchOptions] = useState<BackcodeSearchResult[]>(
    []
  );
  const [branchCode, setBranchCode] = useState<string>();
  const [accountType, setAccountType] = useState<BankAccountType>();
  const [accountNo, setAccountNo] = useState<string>();
  const [holderName, setHolderName] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAccountTypeValid = !!accountType;
  const isAccountNoValid = !!accountNo && !!accountNo?.match(/^\d{1,7}$/);
  const isHolderNameValid =
    !!holderName &&
    !!holderName?.match(
      /^[１２３４５６７８９０ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンガギグゲゴザジズゼソダヂヅデドバビブベボパピプペポヴ（）．－　]+$/
    );
  const isValid = !!(
    bankCode &&
    branchCode &&
    isAccountTypeValid &&
    isAccountNoValid &&
    isHolderNameValid
  );

  const resetBankAccountInfo = () => {
    setAccountType(undefined);
    setAccountNo(undefined);
    setHolderName(undefined);
  };

  const handleBankSearchTextChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setBankSearchText(e.target.value === "" ? undefined : e.target.value);
  };

  const handleBankSearch = () => {
    if (!bankSearchText || bankSearchText.length === 0) return;
    resetBankAccountInfo();
    setBranchCode(undefined);
    setBranchOptions([]);
    setBankCode(undefined);
    setBankOptions([]);
    searchBanks({ text: bankSearchText }).then((result) =>
      setBankOptions(result.banks)
    );
  };

  const handleBankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetBankAccountInfo();
    setBranchCode(undefined);
    const newBankCode = e.target.value === "" ? undefined : e.target.value;
    setBankCode(newBankCode);
    if (newBankCode) {
      searchBranches({ bankCode: newBankCode }).then((result) =>
        setBranchOptions(result.branches)
      );
    } else {
      setBranchOptions([]);
    }
  };

  const handleBranchChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    resetBankAccountInfo();
    setBranchCode(e.target.value === "" ? undefined : e.target.value);
  };

  const handleSubmit = () => {
    if (!isValid) return;
    setIsSubmitting(true);
    createRestaurantBankAccount({
      restaurantId,
      bankCode,
      branchCode,
      accountType,
      accountNo,
      holderName,
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
    <Center w="100vw" h="100vh">
      <VStack>
        <Heading>振込先銀行口座を登録</Heading>
        <FormControl textAlign="center">
          <FormLabel>金融機関を検索</FormLabel>
          <InputGroup>
            <InputLeftElement>
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              onChange={handleBankSearchTextChange}
              value={bankSearchText ?? ""}
            />
          </InputGroup>
          <Button
            color="white"
            mt={2}
            onClick={handleBankSearch}
            isDisabled={!bankSearchText}
          >
            検索
          </Button>
        </FormControl>
        {bankOptions.length > 0 && (
          <FormControl isRequired>
            <FormLabel>金融機関</FormLabel>
            <Select
              value={bankCode}
              placeholder="金融機関を選択"
              onChange={handleBankChange}
            >
              {bankOptions.map((bank) => (
                <option key={bank.code} value={bank.code}>
                  {bank.name}
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {branchOptions.length > 0 && (
          <FormControl isRequired>
            <FormLabel>支店</FormLabel>
            <Select
              value={branchCode}
              placeholder="支店を選択"
              onChange={handleBranchChange}
            >
              {branchOptions.map((branch) => (
                <option key={branch.code} value={branch.code}>
                  {branch.name}({branch.code})
                </option>
              ))}
            </Select>
          </FormControl>
        )}
        {bankCode && branchCode && (
          <>
            <FormControl isRequired isInvalid={!isAccountTypeValid}>
              <FormLabel>預金科目</FormLabel>
              <Select
                value={accountType}
                placeholder="預金科目を選択"
                onChange={(e) =>
                  setAccountType(
                    e.target.value === ""
                      ? undefined
                      : (e.target.value as BankAccountType)
                  )
                }
              >
                {Object.values(BankAccountType).map((type) => (
                  <option key={type} value={type}>
                    {translateBankAccountType(type)}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired isInvalid={!isAccountNoValid}>
              <FormLabel>口座番号(半角数字)</FormLabel>
              <Input
                value={accountNo ?? ""}
                onChange={(e) =>
                  setAccountNo(
                    e.target.value === "" ? undefined : e.target.value
                  )
                }
              />
            </FormControl>
            <FormControl isRequired isInvalid={!isHolderNameValid}>
              <FormLabel>口座名義(全角カナ)</FormLabel>
              <Input
                value={holderName ?? ""}
                onChange={(e) =>
                  setHolderName(
                    e.target.value === "" ? undefined : e.target.value
                  )
                }
              />
            </FormControl>
            <Button
              isLoading={isSubmitting}
              color="white"
              size="lg"
              mt={4}
              isDisabled={!isValid}
              onClick={handleSubmit}
            >
              登録する
            </Button>
          </>
        )}
      </VStack>
    </Center>
  );
}
