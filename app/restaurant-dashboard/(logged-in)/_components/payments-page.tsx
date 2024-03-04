"use client";

import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { Order } from "@prisma/client";
import { Table, TableContainer, Tbody, Th, Thead, Tr } from "@chakra-ui/react";
import { getOrders } from "@/actions/order";
import { translateOrderStatus } from "@/lib/prisma/translate-enum";

export function PaymentsPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getOrders({ where: { meal: { restaurantId: restaurantId } } }).then(
      (result) => {
        setOrders(result);
      }
    );
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
              {order.status === "COMPLETE" ? (
                <>
                  <Th>
                    {order.restaurantProfitPrice.toLocaleString("ja-JP")}円
                  </Th>
                  <Th>{order.price.toLocaleString("ja-JP")}円</Th>
                </>
              ) : (
                <>
                  <Th>0円</Th>
                  <Th>0円</Th>
                </>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
