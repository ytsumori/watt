/*
  Warnings:

  - A unique constraint covering the columns `[clientCode]` on the table `RestaurantBankAccount` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RestaurantBankAccount" ADD COLUMN     "clientCode" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantBankAccount_clientCode_key" ON "RestaurantBankAccount"("clientCode");
