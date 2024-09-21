/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId]` on the table `RestaurantManualClose` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RestaurantManualClose_restaurantId_key" ON "RestaurantManualClose"("restaurantId");
