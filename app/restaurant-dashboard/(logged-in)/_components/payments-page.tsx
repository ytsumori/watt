"use client";

import { useContext, useEffect, useState } from "react";
import { RestaurantIdContext } from "./restaurant-id-provider";
import { getPaymentsByRestaurantId } from "@/actions/payment";
import { Payment } from "@prisma/client";
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

export function PaymentsPage() {
  const restaurantId = useContext(RestaurantIdContext);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    getPaymentsByRestaurantId(restaurantId).then((result) => {
      setPayments(result);
    });
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
          {payments.map((payment) => (
            <Tr key={payment.id}>
              <Th>{payment.createdAt.toLocaleString("ja-JP")}</Th>
              <Th>{payment.amount.toLocaleString("ja-JP")}円</Th>
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
