"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import {
  Box,
  Divider,
  Flex,
  HStack,
  Select,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack
} from "@chakra-ui/react";
import { cancelOrder, getFirstOrder, getOrders } from "./actions";
import { format } from "date-fns";
import { RestaurantIdContext } from "../RestaurantIdProvider";
import { getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { getOrderStatusColor } from "@/utils/order-status";
import { ConfirmModal } from "@/components/confirm-modal";

export function OrdersPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [orders, setOrders] = useState<
    Prisma.OrderGetPayload<{
      select: {
        id: true;
        orderTotalPrice: true;
        orderNumber: true;
        peopleCount: true;
        approvedByRestaurantAt: true;
        canceledAt: true;
        createdAt: true;
        meals: {
          select: {
            id: true;
            meal: { select: { title: true } };
            options: { select: { mealItemOption: { select: { title: true } } } };
          };
        };
      };
    }>[]
  >([]);
  const [monthsOptions, setMonthsOptions] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy/MM"));
  const [isLoading, setIsLoading] = useState(true);
  const [orderId, setOrderId] = useState<string>();

  const fetchOrders = useCallback(
    (month: string) => {
      setIsLoading(true);
      getOrders(restaurantId, month).then((result) => {
        setOrders(result);
        setIsLoading(false);
      });
    },
    [restaurantId]
  );

  useEffect(() => {
    getFirstOrder(restaurantId).then((result) => {
      if (result?.createdAt) {
        let monthsFromStart: string[] = [];
        let currentDate = result.createdAt;
        const endOfThisMonth = new Date();
        endOfThisMonth.setDate(1);
        endOfThisMonth.setMonth(endOfThisMonth.getMonth() + 1);
        while (currentDate < endOfThisMonth) {
          monthsFromStart.push(format(currentDate.toDateString(), "yyyy/MM"));
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        setMonthsOptions(monthsFromStart);
        fetchOrders(format(new Date(), "yyyy/MM"));
      }
    });
  }, [fetchOrders, restaurantId]);

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMonth(event.target.value);
    fetchOrders(event.target.value);
  };

  const handleCancelClick = () => {
    if (!orderId) return;
    cancelOrder(orderId).then(() => {
      fetchOrders(selectedMonth);
      setOrderId(undefined);
    });
  };

  const ordersPriceSum = orders.reduce(
    (total, order) => (order.canceledAt === null ? total + order.orderTotalPrice : total),
    0
  );

  return (
    <>
      <Select value={selectedMonth} onChange={handleMonthChange}>
        {monthsOptions.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </Select>
      {isLoading ? (
        <Text mt={4}>取得中...</Text>
      ) : (
        <>
          <HStack spacing={2} alignItems="baseline" mt={4}>
            <Stat>
              <StatLabel w="max-content">件数</StatLabel>
              <StatNumber w="max-content">{orders.length.toLocaleString("ja-JP")}件</StatNumber>
            </Stat>
            <Stat>
              <StatLabel w="max-content">合計額</StatLabel>
              <StatNumber w="max-content">{ordersPriceSum.toLocaleString("ja-JP")}円</StatNumber>
            </Stat>
            <Stat>
              <StatLabel w="max-content">送客手数料(目安)</StatLabel>
              <StatNumber w="max-content">{Math.floor(ordersPriceSum * 0.05).toLocaleString("ja-JP")}円</StatNumber>
              <StatHelpText w="max-content">注文額x5%</StatHelpText>
            </Stat>
          </HStack>
          <VStack divider={<Divider />} alignItems="start" spacing={1} w="full" mt={4}>
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order);
              const isCancellable =
                orderStatus === "APPROVED" &&
                order.approvedByRestaurantAt &&
                order.approvedByRestaurantAt >= new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000); // less than one day
              return (
                <VStack
                  key={order.id}
                  alignItems="start"
                  spacing={1}
                  w="full"
                  onClick={() => {
                    if (isCancellable) {
                      setOrderId(order.id);
                    }
                  }}
                >
                  <Flex justifyContent="space-between" w="full">
                    <Box>
                      <Text fontSize="xx-small">
                        {order.createdAt ? format(order.createdAt, "yyyy/MM/dd HH:mm") : ""}
                        <br />
                        <Text as="span" fontWeight="bold" color={getOrderStatusColor(orderStatus)}>
                          {translateOrderStatus(orderStatus)}
                        </Text>
                      </Text>
                    </Box>
                    <Box>
                      <Text fontSize="xx-small" textAlign="end">
                        注文番号: <b>#{order.orderNumber}</b>
                        <br />
                        人数: <b>{order.peopleCount}</b>
                      </Text>
                    </Box>
                  </Flex>
                  <Text fontSize="xs">
                    セット内容:
                    <br />
                    {order.meals.map((meal) => (
                      <b key={meal.id}>
                        {meal.meal.title}({meal.options.map((option) => option.mealItemOption.title).join(",")})
                        <br />
                      </b>
                    ))}
                  </Text>
                  <Text fontSize="xs">
                    注文金額: <b>{order.orderTotalPrice.toLocaleString("ja-JP")}円</b>
                  </Text>
                </VStack>
              );
            })}
          </VStack>
          <ConfirmModal
            isOpen={!!orderId}
            onClose={() => setOrderId(undefined)}
            title="注文をキャンセルしますか？"
            confirmButton={{
              label: "注文をキャンセルする",
              onClick: handleCancelClick
            }}
            cancelButton={{
              label: "閉じる"
            }}
          >
            この操作は取り消せません
            <Text color="red.400">※この操作は来店がなかった場合にのみ行ってください。</Text>
          </ConfirmModal>
        </>
      )}
    </>
  );
}
