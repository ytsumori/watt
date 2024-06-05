"use client";

import { useContext, useEffect, useState } from "react";
import { Prisma } from "@prisma/client";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { getOrderStatus, translateOrderStatus } from "@/lib/prisma/order-status";
import { RestaurantIdContext } from "../restaurant-id-provider";
import { getOrders } from "../../_actions/getOrders";

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
                <Th>{translateOrderStatus(orderStatus)}</Th>
                <Th>{order.createdAt.toLocaleString("ja-JP")}</Th>
                {orderStatus === "COMPLETE" && order.payment ? (
                  <>
                    <Th>{order.payment.restaurantProfitPrice.toLocaleString("ja-JP")}円</Th>
                    <Th>{order.payment.totalAmount.toLocaleString("ja-JP")}円</Th>
                  </>
                ) : (
                  <>
                    <Th>-</Th>
                    <Th>-</Th>
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
