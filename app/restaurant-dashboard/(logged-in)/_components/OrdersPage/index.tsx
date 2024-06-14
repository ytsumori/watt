"use client";

import { useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { RestaurantIdContext } from "../restaurant-id-provider";
import { getOrders } from "./actions";

export function OrdersPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [orders, setOrders] = useState<Prisma.OrderGetPayload<{ include: { payment: true } }>[]>([]);

  useEffect(() => {
    getOrders(restaurantId).then((result) => {
      setOrders(result);
    });
  }, [restaurantId]);
  return (
    <TableContainer>
      <Table>
        <Thead>
          <Tr>
            <Th>注文番号</Th>
            <Th>ステータス</Th>
            <Th>注文日時</Th>
            <Th>売上</Th>
            <Th>決済金額</Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => {
            const orderStatus = getOrderStatus(order);
            return (
              <Tr key={order.id}>
                <Td>{order.orderNumber}</Td>
                <Td>{translateOrderStatus(orderStatus)}</Td>
                <Td>{order.createdAt.toLocaleString("ja-JP")}</Td>
                {orderStatus === "COMPLETE" && order.payment ? (
                  <>
                    <Td>{order.payment.restaurantProfitPrice.toLocaleString("ja-JP")}円</Td>
                    <Td>{order.payment.totalAmount.toLocaleString("ja-JP")}円</Td>
                  </>
                ) : (
                  <>
                    <Td>-</Td>
                    <Td>-</Td>
                  </>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
