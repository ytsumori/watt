"use client";
import { Button } from "@chakra-ui/react";
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
  const filteredOrders = orders.filter(isValidOrder);

  const handleClick = async () => {
    if (filteredOrders.length === 0) return;
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
        const bankRecords = await getCsvBankRecords(groupedOrders);
        const blob = convertToBlob(bankRecords);
        const link = document.createElement("a");
        link.download = "download.csv";
        link.href = URL.createObjectURL(blob);
        link.click();
        URL.revokeObjectURL(link.href);
      })
      .catch((e) => console.error(e));
    setIsLoading(false);
    router.refresh();
  };

  return (
    <Button
      onClick={handleClick}
      marginLeft="auto"
      minWidth="auto"
      isDisabled={filteredOrders.length === 0 || isLoading}
    >
      {isLoading ? "処理中" : "CSVダウンロード"}
    </Button>
  );
};
