/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId]` on the table `RestaurantBankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RestaurantBankAccount_restaurantId_key" ON "RestaurantBankAccount"("restaurantId");
