"use client";

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { convertToBlob, isValidPayment } from "./util";
import { getCsvBankRecords } from "./action";
import { useRouter } from "next/navigation";
import { DownloadablePayment, RestaurantWithPayments } from "./type";
import { updatePaymentsDownloaded } from "../../_actions/updatePaymentsDownloaded";

type PaymentsCsvDownloadButtonProps = {
  payments: DownloadablePayment[];
};
export const PaymentsCsvDownloadButton: FC<PaymentsCsvDownloadButtonProps> = ({ payments }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [transferDate, setTransferDate] = useState<string>("");
  const filteredPayments = payments.filter(isValidPayment);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async () => {
    if (filteredPayments.length === 0) return;
    if (transferDate === "") return;
    setIsLoading(true);
    await updatePaymentsDownloaded({ paymentIds: filteredPayments.map((payment) => payment.id) })
      .then(async () => {
        let groupedOrders: RestaurantWithPayments[] = [];
        filteredPayments.forEach((payment) => {
          const completedAt = payment.completedAt;
          if (completedAt) {
            const currentIndex = groupedOrders.findIndex(
              (groupedOrder) => groupedOrder.restaurantId === payment.order.meal.restaurant.id
            );
            if (currentIndex === -1 && payment.order.meal.restaurant.bankAccount) {
              groupedOrders.push({
                restaurantId: payment.order.meal.restaurant.id,
                bankAccount: payment.order.meal.restaurant.bankAccount,
                payments: [{ ...payment, completedAt }]
              });
            } else {
              groupedOrders[currentIndex].payments.push({ ...payment, completedAt });
            }
          }
        });

        const bankRecords = await getCsvBankRecords(new Date(transferDate), groupedOrders);
        const blob = convertToBlob(bankRecords);
        const link = document.createElement("a");
        const today = new Date();
        link.download = `振込依頼ファイル-${today.toLocaleDateString("ja-JP").replaceAll("/", "-")}.csv`;
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((e) => console.error(e));
    setIsLoading(false);
    setTransferDate("");
    onClose();
    router.refresh();
  };

  return (
    <>
      <Button onClick={onOpen} marginLeft="auto" minWidth="auto" isDisabled={filteredPayments.length === 0}>
        CSVダウンロード
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>振込を行う日を指定してください</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input type="date" value={transferDate} onChange={(e) => setTransferDate(e.target.value)} />
          </ModalBody>

          <ModalFooter gap={3}>
            <Button
              onClick={handleClick}
              isDisabled={filteredPayments.length === 0 || isLoading || transferDate === ""}
            >
              {isLoading ? "処理中" : "CSVダウンロード"}
            </Button>
            <Button onClick={onClose} variant="outline" colorScheme="gray">
              close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
