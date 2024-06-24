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
import { RestaurantIdContext } from "../restaurant-id-provider";
import { getFirstOrder, getOrders } from "./actions";
import { format } from "date-fns";

export function OrdersPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [orders, setOrders] = useState<
    Prisma.OrderGetPayload<{
      select: {
        id: true;
        orderTotalPrice: true;
        orderNumber: true;
        peopleCount: true;
        completedAt: true;
        createdAt: true;
        meals: {
          select: {
            id: true;
            quantity: true;
            meal: { select: { title: true } };
            options: { select: { mealItemOption: { select: { title: true } } } };
          };
        };
        payment: {
          select: {
            totalAmount: true;
          };
        };
      };
    }>[]
  >([]);
  const [monthsOptions, setMonthsOptions] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>(format(new Date(), "yyyy/MM"));
  const [isLoading, setIsLoading] = useState(true);

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
      if (result?.completedAt) {
        let monthsFromStart: string[] = [];
        let currentDate = result.completedAt;
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

  const ordersPriceSum = orders.reduce((total, order) => total + order.orderTotalPrice, 0);
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
              <StatLabel w="max-content">注文額</StatLabel>
              <StatNumber w="max-content">{ordersPriceSum.toLocaleString("ja-JP")}円</StatNumber>
            </Stat>
            <Stat>
              <StatLabel w="max-content">送客手数料(目安)</StatLabel>
              <StatNumber w="max-content">{Math.floor(ordersPriceSum * 0.05).toLocaleString("ja-JP")}円</StatNumber>
              <StatHelpText w="max-content">注文額x5%</StatHelpText>
            </Stat>
            <Stat>
              <StatLabel w="max-content">Watt決済額</StatLabel>
              <StatNumber w="max-content">
                {orders.reduce((total, order) => total + (order.payment?.totalAmount ?? 0), 0).toLocaleString("ja-JP")}
                円
              </StatNumber>
            </Stat>
          </HStack>
          <VStack divider={<Divider />} alignItems="start" spacing={1} w="full" mt={4}>
            {orders.map((order) => (
              <VStack key={order.id} alignItems="start" spacing={1} w="full">
                <Flex justifyContent="space-between" w="full">
                  <Text fontSize="xx-small">
                    {order.completedAt ? format(order.completedAt, "yyyy/MM/dd HH:mm") : ""}
                  </Text>
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
                      {meal.meal.title}({meal.options.map((option) => option.mealItemOption.title).join(",")}) x{" "}
                      {meal.quantity}
                      <br />
                    </b>
                  ))}
                </Text>
                <Text fontSize="xs">
                  注文金額: <b>{order.orderTotalPrice.toLocaleString("ja-JP")}円</b>
                </Text>
                <Text fontSize="xs">
                  Watt決済額: {order.payment ? <b>{order.payment.totalAmount.toLocaleString("ja-JP")}円</b> : "-"}
                </Text>
              </VStack>
            ))}
          </VStack>
        </>
      )}
    </>
  );
}
