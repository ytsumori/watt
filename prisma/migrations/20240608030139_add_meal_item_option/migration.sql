-- AlterTable
ALTER TABLE "MealItem" ALTER COLUMN "position" DROP DEFAULT;
DROP SEQUENCE "MealItem_position_seq";

-- CreateTable
CREATE TABLE "MealItemOption" (
    "id" TEXT NOT NULL,
    "mealItemId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "extraPrice" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MealItemOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderMealOption" (
    "id" TEXT NOT NULL,
    "orderMealId" TEXT NOT NULL,
    "mealItemOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderMealOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MealItemOption_mealItemId_position_key" ON "MealItemOption"("mealItemId", "position");

-- AddForeignKey
ALTER TABLE "MealItemOption" ADD CONSTRAINT "MealItemOption_mealItemId_fkey" FOREIGN KEY ("mealItemId") REFERENCES "MealItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMealOption" ADD CONSTRAINT "OrderMealOption_orderMealId_fkey" FOREIGN KEY ("orderMealId") REFERENCES "OrderMeal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMealOption" ADD CONSTRAINT "OrderMealOption_mealItemOptionId_fkey" FOREIGN KEY ("mealItemOptionId") REFERENCES "MealItemOption"("id") ON DELETE CASCADE ON UPDATE CASCADE;
