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
  useDisclosure,
} from "@chakra-ui/react";
import { FC, useState } from "react";
import { convertToBlob, isValidOrder } from "./util";
import { getCsvBankRecords } from "./action";
import { updateManyOrdersIsDownloaded } from "@/actions/order";
import { useRouter } from "next/navigation";
import { DownloadableOrder, RestaurantWithOrders } from "./type";

type OrdersCsvDownloadButtonProps = {
  orders: DownloadableOrder[];
};
export const OrdersCsvDownloadButton: FC<OrdersCsvDownloadButtonProps> = ({ orders }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [transferDate, setTransferDate] = useState<string>("");
  const filteredOrders = orders.filter(isValidOrder);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClick = async () => {
    if (filteredOrders.length === 0) return;
    if (transferDate === "") return;
    setIsLoading(true);
    await updateManyOrdersIsDownloaded(filteredOrders.map((order) => order.id))
      .then(async () => {
        let groupedOrders: RestaurantWithOrders[] = [];
        filteredOrders.forEach((order) => {
          const currentIndex = groupedOrders.findIndex(
            (groupedOrder) => groupedOrder.restaurantId === order.meal.restaurant.id
          );
          if (currentIndex === -1 && order.meal.restaurant.bankAccount) {
            groupedOrders.push({
              restaurantId: order.meal.restaurant.id,
              bankAccount: order.meal.restaurant.bankAccount,
              orders: [order],
            });
          } else {
            groupedOrders[currentIndex].orders.push(order);
          }
        });

        const bankRecords = await getCsvBankRecords(new Date(transferDate), groupedOrders);
        const blob = convertToBlob(bankRecords);
        const link = document.createElement("a");
        link.download = `export-${new Date().toLocaleString("ja-JP")}.csv`;
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
      <Button onClick={onOpen} marginLeft="auto" minWidth="auto" isDisabled={filteredOrders.length === 0}>
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
            <Button onClick={handleClick} isDisabled={filteredOrders.length === 0 || isLoading || transferDate === ""}>
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
