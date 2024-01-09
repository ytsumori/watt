/*
  Warnings:

  - You are about to drop the `RestaurantActiveDay` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RestaurantActiveDuration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantActiveDay" DROP CONSTRAINT "RestaurantActiveDay_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantActiveDuration" DROP CONSTRAINT "RestaurantActiveDuration_restaurantActiveDayId_fkey";

-- DropTable
DROP TABLE "RestaurantActiveDay";

-- DropTable
DROP TABLE "RestaurantActiveDuration";

-- CreateTable
CREATE TABLE "RestaurantOpenDay" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,

    CONSTRAINT "RestaurantOpenDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantOpenHour" (
    "id" TEXT NOT NULL,
    "restaurantOpenDayId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantOpenHour_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantOpenDay" ADD CONSTRAINT "RestaurantOpenDay_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantOpenHour" ADD CONSTRAINT "RestaurantOpenHour_restaurantOpenDayId_fkey" FOREIGN KEY ("restaurantOpenDayId") REFERENCES "RestaurantOpenDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
