"use client";

import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { Prisma } from "@prisma/client";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";

import { translateOrderStatus } from "@/lib/prisma/translate-enum";
import { getOrders } from "../_actions/getOrders";

export function PaymentsPage() {
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
          {orders.map((order) => (
            <Tr key={order.id}>
              <Th>{translateOrderStatus(order.status)}</Th>
              <Th>{order.createdAt.toLocaleString("ja-JP")}</Th>
              {order.status === "COMPLETE" && order.payment ? (
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
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
