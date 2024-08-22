import { Prisma } from "@prisma/client";

export type MealWithItems = Prisma.MealGetPayload<{
  include: { items: { include: { options: { orderBy: { position: "asc" } } } } };
}>;
