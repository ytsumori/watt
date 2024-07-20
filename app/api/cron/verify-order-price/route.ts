import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/client";
import { sendSlackMessage } from "@/lib/slack";
import { Prisma } from "@prisma/client";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", {
      status: 401
    });
  }

  const beginningOfYesterday = new Date();
  beginningOfYesterday.setDate(beginningOfYesterday.getDate() - 1);
  beginningOfYesterday.setHours(0, 0, 0, 0);
  const endOfYesterday = new Date();
  endOfYesterday.setDate(endOfYesterday.getDate() - 1);
  endOfYesterday.setHours(23, 59, 59, 999);

  const orders = await prisma.order.findMany({
    select: {
      id: true,
      orderTotalPrice: true,
      meals: {
        select: {
          meal: { select: { price: true } },
          options: { select: { mealItemOption: { select: { extraPrice: true } } } }
        }
      },
      payment: { select: { totalAmount: true } }
    },
    where: {
      createdAt: {
        gte: beginningOfYesterday,
        lte: endOfYesterday
      }
    }
  });

  const verifyOrderPrice = async (
    order: Prisma.OrderGetPayload<{
      select: {
        id: true;
        orderTotalPrice: true;
        meals: {
          select: {
            meal: { select: { price: true } };
            options: { select: { mealItemOption: { select: { extraPrice: true } } } };
          };
        };
      };
    }>
  ) => {
    const calculatedTotalPrice = order.meals.reduce((acc, orderMeal) => {
      const mealPrice = orderMeal.meal.price;
      const optionPrice = orderMeal.options.reduce((acc, option) => {
        return acc + option.mealItemOption.extraPrice;
      }, 0);
      return acc + mealPrice + optionPrice;
    }, 0);

    if (order.orderTotalPrice !== calculatedTotalPrice) {
      await sendSlackMessage({
        channel: "errorLogs",
        text: `Order price mismatch for order ${order.id} - expected: ${calculatedTotalPrice}, actual: ${order.orderTotalPrice}`
      });
    }
  };

  await Promise.all(orders.map(verifyOrderPrice));

  return NextResponse.json({ success: true });
}
