/*
  Warnings:

  - You are about to drop the `RestaurantGoogleMapOpeningHours` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantGoogleMapOpeningHours" DROP CONSTRAINT "RestaurantGoogleMapOpeningHours_restaurantId_fkey";

-- DropTable
DROP TABLE "RestaurantGoogleMapOpeningHours";

-- CreateTable
CREATE TABLE "RestaurantGoogleMapOpeningHour" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "openHour" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "openDayOfWeek" "DayOfWeek" NOT NULL,
    "closeHour" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    "closeDayOfWeek" "DayOfWeek" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantGoogleMapOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantGoogleMapOpeningHour_restaurantId_key" ON "RestaurantGoogleMapOpeningHour"("restaurantId");

-- AddForeignKey
ALTER TABLE "RestaurantGoogleMapOpeningHour" ADD CONSTRAINT "RestaurantGoogleMapOpeningHour_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
