"use client";

import { getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { getOrderStatusColor } from "@/utils/order-status";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
import { useRouter } from "next-nprogress-bar";
import NextLink from "next/link";
import { Fragment } from "react";

type Props = {
  orders: Prisma.OrderGetPayload<{
    select: {
      id: true;
      orderNumber: true;
      peopleCount: true;
      approvedByRestaurantAt: true;
      canceledAt: true;
      createdAt: true;
      orderTotalPrice: true;
      meals: {
        select: {
          id: true;
          meal: { select: { title: true; price: true } };
          options: { select: { mealItemOption: { select: { title: true; extraPrice: true } } } };
        };
      };
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
              <Th>ステータス</Th>
              <Th>店名</Th>
              <Th>人数</Th>
              <Th>注文金額</Th>
              <Th>注文日時</Th>
              <Th>セット内容</Th>
            </Tr>
          </Thead>
          <Tbody>
            {orders.map((order) => {
              const orderStatus = getOrderStatus(order);
              return (
                <Tr key={order.id}>
                  <Td>#{order.orderNumber}</Td>
                  <Td color={getOrderStatusColor(orderStatus)}>{translateOrderStatus(orderStatus)}</Td>
                  <Td>
                    <Link as={NextLink} href={"restaurants/" + order.restaurant.id}>
                      {order.restaurant.name}
                    </Link>
                  </Td>
                  <Td>{order.peopleCount}</Td>
                  <Td>{order.orderTotalPrice.toLocaleString("ja-JP")}円</Td>
                  <Td>{order.createdAt && format(order.createdAt, "yyyy/MM/dd HH:mm")}</Td>
                  <Td>
                    {order.meals.map((meal) => (
                      <Fragment key={meal.id}>
                        {meal.meal.title}
                        {meal.options.length > 0 &&
                          `(${meal.options.map((option) => option.mealItemOption.title).join(",")})`}
                        <br />
                      </Fragment>
                    ))}
                  </Td>
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
