import { Prisma } from "@prisma/client";

export type ConvertedOrderInfo = {
  restaurantName: string;
  bankAccount:
    | Prisma.RestaurantBankAccountGetPayload<
      Prisma.RestaurantBankAccountDefaultArgs
    >
    | null;
} & Prisma.OrderGetPayload<Prisma.OrderDefaultArgs>;

export const convertRequiredOrderInfo = (
  restaurants: Prisma.RestaurantGetPayload<
    { include: { meals: { include: { orders: true } }; bankAccount: true } }
  >[],
): ConvertedOrderInfo[] => {
  return restaurants
    .map((restaurant) => {
      return restaurant.meals.map((meal) => {
        return meal.orders.map((order) => {
          return {
            restaurantName: restaurant.name,
            bankAccount: restaurant.bankAccount,
            ...order,
          };
        });
      });
    })
    .flatMap((x) => x.flatMap((x) => x))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
};
