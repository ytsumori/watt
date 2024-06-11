import { Prisma } from "@prisma/client";

export function getOrderTotalPrice(
  order: Prisma.OrderGetPayload<{
    select: {
      meals: {
        select: {
          meal: { select: { price: true } };
          options: { select: { mealItemOption: { select: { extraPrice: true } } } };
          quantity: true;
        };
      };
    };
  }>
) {
  return order.meals.reduce((acc, orderMeal) => {
    const mealPrice = orderMeal.meal.price;
    const optionPrice = orderMeal.options.reduce((acc, option) => {
      return acc + option.mealItemOption.extraPrice;
    }, 0);
    return acc + mealPrice + optionPrice * orderMeal.quantity;
  }, 0);
}
