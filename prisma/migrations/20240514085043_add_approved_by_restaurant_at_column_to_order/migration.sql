/*
  Warnings:

  - You are about to drop the column `isDownloaded` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `providerPaymentId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantProfitPrice` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "isDownloaded",
DROP COLUMN "price",
DROP COLUMN "providerPaymentId",
DROP COLUMN "restaurantProfitPrice",
ADD COLUMN     "approvedByRestaurantAt" TIMESTAMP(3);
