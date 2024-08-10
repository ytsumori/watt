"use client";

import {
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Spinner,
  Button,
  Input,
  Flex,
  Checkbox,
  useToast
} from "@chakra-ui/react";
import { getBank, getBranch } from "@/lib/bankcode-jp";
import { Prisma } from "@prisma/client";
import { FC, useEffect, useState } from "react";
import { translateBankAccountType } from "@/lib/prisma/translate-enum";
import { isValidHolderName } from "@/utils/zengin";
import { updateRestaurantBankAccount } from "@/actions/mutations/restaurant-bank-account";
import { useRouter } from "next-nprogress-bar";

type BankAccount = Prisma.RestaurantBankAccountGetPayload<Prisma.RestaurantBankAccountDefaultArgs>;
type RestaurantBankAccountProps = { restaurantBankAccount: BankAccount };

export const RestaurantBankAccount: FC<RestaurantBankAccountProps> = ({ restaurantBankAccount }) => {
  const [bankName, setBankName] = useState<string | null>(null);
  const [branchName, setBranchName] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [holderName, setHolderName] = useState<string>(restaurantBankAccount.holderName);
  const [isAdminConfirmed, setIsAdminConfirmed] = useState<boolean>(restaurantBankAccount.isAdminConfirmed);
  const router = useRouter();
  const toast = useToast();

  const isHolderNameInvalid = !isValidHolderName(holderName);

  useEffect(() => {
    getBank({ bankCode: restaurantBankAccount.bankCode }).then((bank) => {
      bank.name && setBankName(bank.name);
      // @description: bankcode-jpのAPI制限により、setTimeoutで遅延させている
      setTimeout(() => {
        getBranch({
          bankCode: restaurantBankAccount.bankCode,
          branchCode: restaurantBankAccount.branchCode
        }).then((result) => result.branch?.name && setBranchName(result.branch.name));
      }, 1500);
    });
  }, [restaurantBankAccount]);

  const onSave = async () => {
    if (isEditMode) {
      await updateRestaurantBankAccount({
        restaurantId: restaurantBankAccount.restaurantId,
        bankAccount: { ...restaurantBankAccount, holderName, isAdminConfirmed }
      })
        .then(() => {
          setIsEditMode(false);
          router.refresh();
        })
        .catch(() => toast({ title: "口座情報の更新に失敗しました", status: "error" }));
    }
  };

  const onEditMode = () => setIsEditMode(true);

  const onClose = () => {
    setHolderName(restaurantBankAccount.holderName);
    setIsAdminConfirmed(restaurantBankAccount.isAdminConfirmed);
    setIsEditMode(false);
  };

  const onChangeHolderName = (e: React.ChangeEvent<HTMLInputElement>) => setHolderName(e.target.value);
  const onChangeAdminCheck = (e: React.ChangeEvent<HTMLInputElement>) => setIsAdminConfirmed(e.target.checked);

  return (
    <>
      <Flex gap={3} marginBottom={2} justifyItems="center">
        <Text as="h2" fontSize="lg" fontWeight="bold">
          現在の口座情報
        </Text>
        {isEditMode ? (
          <>
            <Button onClick={onSave} isDisabled={isHolderNameInvalid}>
              保存する
            </Button>
            <Button onClick={onClose}>閉じる</Button>
          </>
        ) : (
          <Button onClick={onEditMode}>編集する</Button>
        )}
      </Flex>
      <TableContainer border="solid" borderColor="gray" borderWidth={2} borderRadius={10} padding={1}>
        <Table>
          <Thead>
            <Tr>
              <Th>管理者チェック</Th>
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
                <Checkbox
                  onChange={onChangeAdminCheck}
                  borderColor="gray"
                  isChecked={isAdminConfirmed}
                  disabled={!isEditMode}
                />
              </Td>
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
                  <Input
                    onChange={onChangeHolderName}
                    value={holderName}
                    border="solid"
                    borderColor="gray"
                    borderWidth={2}
                    isInvalid={isHolderNameInvalid}
                  />
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
