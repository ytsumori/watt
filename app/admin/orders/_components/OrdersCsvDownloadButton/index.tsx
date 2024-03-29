"use client";
import { Button } from "@chakra-ui/react";
import { FC } from "react";
import { ConvertedOrderInfo } from "../../_util/convertRequiredOrderInfo";
import { convertToBlob, isValidOrders } from "./util";
import { getCsvBankRecords } from "./action";
import { updateManyOrdersIsDownloaded } from "@/actions/order";

type OrdersCsvDownloadButtonProps = { orders: ConvertedOrderInfo[] };
export const OrdersCsvDownloadButton: FC<OrdersCsvDownloadButtonProps> = ({ orders }) => {
  const filteredOrders = orders.filter(isValidOrders);
  const orderIds = filteredOrders.map((order) => order.id);
  const onClick = async () => {
    if (orderIds.length === 0) return;
    await updateManyOrdersIsDownloaded(orderIds)
      .then(async () => {
        const bankRecords = await getCsvBankRecords(filteredOrders);
        const blob = convertToBlob(bankRecords);
        const link = document.createElement("a");
        link.download = "download.csv";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((e) => console.error(e));
  };

  return (
    <Button onClick={onClick} marginLeft="auto" minWidth="auto" isDisabled={orderIds.length === 0}>
      CSVダウンロード
    </Button>
  );
};
