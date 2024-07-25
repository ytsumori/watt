import prisma from "@/lib/prisma/client";
import { OrderMealModal } from "./_components/OrderMealModal";
import { redirect } from "next/navigation";

type Params = { params: { orderMealId: string } };

export default async function OrderMeal({ params }: Params) {
  const orderMeal = await prisma.orderMeal.findUnique({
    where: { id: params.orderMealId },
    select: {
      order: {
        select: {
          isDiscounted: true
        }
      },
      options: {
        select: {
          mealItemOption: {
            select: {
              id: true,
              mealItemId: true
            }
          }
        }
      },
      meal: {
        include: {
          items: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              description: true,
              options: {
                select: {
                  id: true,
                  title: true,
                  extraPrice: true
                }
              }
            }
          }
        }
      }
    }
  });
  if (!orderMeal) {
    redirect("/");
  }

  return <OrderMealModal orderMeal={orderMeal} />;
}
