"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  Heading,
  IconButton,
  Flex
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Fragment } from "react";

type Props = {
  orders: Prisma.OrderGetPayload<{
    select: {
      id: true;
      orderNumber: true;
      peopleCount: true;
      completedAt: true;
      orderTotalPrice: true;
      meals: {
        select: {
          id: true;
          meal: { select: { title: true; price: true } };
          options: { select: { mealItemOption: { select: { title: true; extraPrice: true } } } };
          quantity: true;
        };
      };
      payment: { select: { totalAmount: true } };
      restaurant: { select: { id: true; name: true } };
    };
  }>[];
  page: number;
  maxPage: number;
};

export function OrdersPage({ orders, page, maxPage }: Props) {
  const router = useRouter();
  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        注文一覧
      </Heading>
      <TableContainer>
        <Table>
          <Thead>
            <Tr>
              <Th>注文番号</Th>
              <Th>店名</Th>
              <Th>人数</Th>
              <Th>セット内容</Th>
              <Th>注文金額</Th>
              <Th>Watt支払い</Th>
              <Th>注文日時</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => {
              return (
                <Tr key={order.id}>
                  <Td>#{order.orderNumber}</Td>
                  <Td>
                    <Link as={NextLink} href={"restaurants/" + order.restaurant.id}>
                      {order.restaurant.name}
                    </Link>
                  </Td>
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
                  <Td>{order.orderTotalPrice.toLocaleString("ja-JP")}円</Td>
                  <Td>{order.payment ? `${order.payment.totalAmount.toLocaleString("ja-JP")}円` : "-"}</Td>
                  <Td>{order.completedAt && format(order.completedAt, "yyyy/MM/dd HH:mm")}</Td>
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Flex justify="space-between" mt={4}>
        <IconButton
          aria-label="previous-page"
          icon={<ArrowLeftIcon />}
          onClick={() => router.push(`/admin/orders?page=${page - 1}`)}
          isDisabled={page <= 1}
        />
        <IconButton
          aria-label="next-page"
          icon={<ArrowRightIcon />}
          onClick={() => router.push(`/admin/orders?page=${page + 1}`)}
          isDisabled={page >= maxPage}
        />
      </Flex>
    </Box>
  );
}
