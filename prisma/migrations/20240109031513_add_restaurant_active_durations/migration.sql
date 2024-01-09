-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateTable
CREATE TABLE "RestaurantActiveDay" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "day" "DayOfWeek" NOT NULL,

    CONSTRAINT "RestaurantActiveDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantActiveDuration" (
    "id" TEXT NOT NULL,
    "restaurantActiveDayId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RestaurantActiveDuration_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantActiveDay" ADD CONSTRAINT "RestaurantActiveDay_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantActiveDuration" ADD CONSTRAINT "RestaurantActiveDuration_restaurantActiveDayId_fkey" FOREIGN KEY ("restaurantActiveDayId") REFERENCES "RestaurantActiveDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;
