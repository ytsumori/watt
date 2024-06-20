import prisma from "@/lib/prisma/client";
import {
  HStack,
  Heading,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack
} from "@chakra-ui/react";
import { format } from "date-fns";
import { getOrderTotalPrice } from "@/lib/prisma/order-total-price";
import { Fragment } from "react";
import { MonthSelect } from "./MonthSelect";

type Props = {
  restaurantId: string;
  month?: string;
};

export async function RestaurantOrdersSection({ restaurantId, month }: Props) {
  const firstOrder = await prisma.order.findFirst({
    select: {
      completedAt: true
    },
    where: {
      restaurantId: restaurantId,
      completedAt: { not: null }
    },
    orderBy: {
      completedAt: "asc"
    }
  });

  const beginningOfMonth = new Date(month ?? format(new Date(), "yyyy-MM"));
  const endOfMonth = new Date(month ?? format(new Date(), "yyyy-MM"));
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderNumber: true,
      peopleCount: true,
      completedAt: true,
      meals: {
        select: {
          id: true,
          meal: { select: { price: true, title: true } },
          options: { select: { mealItemOption: { select: { extraPrice: true, title: true } } } },
          quantity: true
        }
      },
      payment: { select: { totalAmount: true } }
    },
    where: {
      restaurantId,
      completedAt: {
        gte: beginningOfMonth,
        lt: endOfMonth
      }
    }
  });

  if (!firstOrder) return <></>;
  if (!firstOrder.completedAt) return <></>;

  // create a list of months from the first order to the current month
  let monthsFromStart: string[] = [];
  let currentDate = firstOrder.completedAt;
  while (currentDate < new Date()) {
    monthsFromStart.push(format(currentDate.toDateString(), "yyyy-MM"));
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  const totalOrderAmount = orders.reduce((total, order) => total + getOrderTotalPrice(order), 0);

  return (
    <VStack width="full" alignItems="baseline" spacing={6}>
      <Heading size="md">売上</Heading>
      <MonthSelect monthOptions={monthsFromStart} />
      <HStack spacing={8} alignItems="baseline">
        <Stat>
          <StatLabel w="max-content">合計注文額</StatLabel>
          <StatNumber w="max-content">{totalOrderAmount.toLocaleString("ja-JP")}円</StatNumber>
        </Stat>
        <Stat>
          <StatLabel w="max-content">送客手数料</StatLabel>
          <StatNumber w="max-content">{Math.floor(totalOrderAmount * 0.05).toLocaleString("ja-JP")}円</StatNumber>
          <StatHelpText w="max-content">合計注文額 x 5%</StatHelpText>
        </Stat>
        <Stat>
          <StatLabel w="max-content">Watt決済額</StatLabel>
          <StatNumber w="max-content">
            {orders.reduce((total, order) => total + (order.payment?.totalAmount ?? 0), 0).toLocaleString("ja-JP")}円
          </StatNumber>
        </Stat>
      </HStack>
      <Heading size="sm">注文一覧</Heading>
      <TableContainer>
        <Table variant="simple" size="sm">
          <Thead>
            <Tr>
              <Th>注文番号</Th>
              <Th>人数</Th>
              <Th>セット内容</Th>
              <Th>注文金額</Th>
              <Th>Watt支払い</Th>
              <Th>注文日時</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => (
              <Tr key={order.id}>
                <Td>#{order.orderNumber}</Td>
                <Td>{order.peopleCount}</Td>
                <Td>
                  {order.meals.map((meal) => (
                    <Fragment key={meal.id}>
                      {meal.meal.title}({meal.options.map((option) => option.mealItemOption.title).join(",")}) x
                      {meal.quantity}
                      <br />
                    </Fragment>
                  ))}
                </Td>
                <Td>{getOrderTotalPrice(order).toLocaleString("ja-JP")}円</Td>
                <Td>{order.payment ? `${order.payment.totalAmount.toLocaleString("ja-JP")}円` : "-"}</Td>
                <Td>{order.completedAt ? format(order.completedAt, "yyyy-MM-dd HH:mm") : ""}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </VStack>
  );
}
