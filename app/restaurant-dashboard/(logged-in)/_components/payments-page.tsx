"use client";

import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { Order } from "@prisma/client";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { getOrders } from "@/actions/order";

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
            <Th>注文日時</Th>
            <Th>金額</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {orders.map((order) => (
            <Tr key={order.id}>
              <Th>{order.createdAt.toLocaleString("ja-JP")}</Th>
              <Th>{order.price.toLocaleString("ja-JP")}円</Th>
              <Th>
                <Menu>
                  <MenuButton>操作</MenuButton>
                  <MenuList>
                    <MenuItem onClick={() => console.error("TODO: Implement")}>
                      キャンセル(返金)
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Th>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
