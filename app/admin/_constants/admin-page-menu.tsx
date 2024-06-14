import { ReactElement } from "react";
import { FaShop, FaMoneyCheck } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import { As } from "@chakra-ui/react";

export const ADMIN_PAGE_MENU: { title: string; pathname: string; icon: ReactElement }[] = [
  {
    title: "レストラン一覧",
    pathname: "/admin/restaurants",
    icon: <FaShop />
  },
  {
    title: "決済一覧",
    pathname: "/admin/payments",
    icon: <FaMoneyCheck />
  },
  {
    title: "注文一覧",
    pathname: "/admin/orders",
    icon: <FaShoppingCart />
  }
];
