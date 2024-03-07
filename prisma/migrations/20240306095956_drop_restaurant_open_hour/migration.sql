/*
  Warnings:

  - You are about to drop the `RestaurantOpenHour` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantOpenHour" DROP CONSTRAINT "RestaurantOpenHour_restaurantId_fkey";

-- DropTable
DROP TABLE "RestaurantOpenHour";
