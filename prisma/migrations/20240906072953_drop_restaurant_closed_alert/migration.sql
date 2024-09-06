/*
  Warnings:

  - You are about to drop the `RestaurantClosedAlert` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantClosedAlert" DROP CONSTRAINT "RestaurantClosedAlert_restaurantId_fkey";

-- DropTable
DROP TABLE "RestaurantClosedAlert";
