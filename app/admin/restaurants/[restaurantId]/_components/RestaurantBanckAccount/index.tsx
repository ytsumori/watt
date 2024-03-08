"use client";

import { Text, TableContainer, Table, Thead, Tr, Th, Tbody, Td, Spinner, Button, Input, Flex } from "@chakra-ui/react";
import { getBank, getBranch } from "@/lib/bankcode-jp";
import { Prisma } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { translateBankAccountType } from "@/lib/prisma/translate-enum";
import { updateRestaurantBankAccount } from "@/actions/restaurant-bank-account";
import { useRouter } from "next/navigation";

type BankAccount = Prisma.RestaurantBankAccountGetPayload<Prisma.RestaurantBankAccountDefaultArgs>;
type RestaurantBankAccountProps = { restaurantBankAccount: BankAccount };

export const RestaurantBankAccount: FC<RestaurantBankAccountProps> = ({ restaurantBankAccount }) => {
  const [bankName, setBankName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [holderName, setHolderName] = useState<string>(restaurantBankAccount.holderName);
  const router = useRouter();

  useEffect(() => {
    getBank({ bankCode: restaurantBankAccount.bankCode }).then((bank) => {
      bank.name && setBankName(bank.name);
      // @description: bankcode-jpのAPI制限により、setTimeoutで遅延させている
      setTimeout(() => {
        getBranch({
          bankCode: restaurantBankAccount.bankCode,
          branchCode: restaurantBankAccount.branchCode,
        }).then((result) => result.branch?.name && setBranchName(result.branch.name));
      }, 1500);
    });
  }, [restaurantBankAccount]);

  const onClick = () => {
    if (isEditMode) {
      updateRestaurantBankAccount({ ...restaurantBankAccount, holderName });
      router.refresh();
    }
    setIsEditMode((prev) => !prev);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => setHolderName(e.target.value);

  return (
    <>
      <Flex gap={3} marginTop={5} marginBottom={2} justifyItems="center">
        <Text as="h2" fontSize="lg" fontWeight="bold">
          現在の口座情報
        </Text>
        <Button onClick={onClick}>{isEditMode ? "保存する" : "編集する"}</Button>
      </Flex>
      <TableContainer border="solid" borderColor="gray" borderWidth={2} borderRadius={10} padding={1} shadow={100}>
        <Table>
          <Thead>
            <Tr>
              <Th>金融機関</Th>
              <Th>支店</Th>
              <Th>口座種別</Th>
              <Th>口座番号</Th>
              <Th>口座名義</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>
                {bankName ?? <Spinner size="sm" />}
                {`（${restaurantBankAccount.bankCode}）`}
              </Td>
              <Td>
                {branchName ?? <Spinner size="sm" />}
                {`（${restaurantBankAccount.branchCode}）`}
              </Td>
              <Td>{restaurantBankAccount.accountNo}</Td>
              <Td>{translateBankAccountType(restaurantBankAccount.accountType)}</Td>
              <Td>
                {isEditMode ? (
                  <Input onChange={onChange} value={holderName} autoFocus />
                ) : (
                  restaurantBankAccount.holderName
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};
