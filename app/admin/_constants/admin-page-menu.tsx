import { ReactElement } from "react";
import { FaShop } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";

export const ADMIN_PAGE_MENU: { title: string; pathname: string; icon: ReactElement }[] = [
  {
    title: "レストラン一覧",
    pathname: "/admin/restaurants",
    icon: <FaShop />
  },
  {
    title: "注文一覧",
    pathname: "/admin/orders",
    icon: <FaShoppingCart />
  }
];
