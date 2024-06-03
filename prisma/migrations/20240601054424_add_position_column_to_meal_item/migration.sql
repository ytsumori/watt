/*
  Warnings:

  - A unique constraint covering the columns `[mealId,position]` on the table `MealItem` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "MealItem" ADD COLUMN     "position" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "MealItem_mealId_position_key" ON "MealItem"("mealId", "position");
