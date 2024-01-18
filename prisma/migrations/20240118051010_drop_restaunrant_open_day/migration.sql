/*
  Warnings:

  - You are about to drop the column `end` on the `RestaurantOpenHour` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantOpenDayId` on the `RestaurantOpenHour` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `RestaurantOpenHour` table. All the data in the column will be lost.
  - You are about to drop the `RestaurantOpenDay` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `day` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endHour` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endMinute` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `restaurantId` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startHour` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startMinute` to the `RestaurantOpenHour` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RestaurantOpenDay" DROP CONSTRAINT "RestaurantOpenDay_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "RestaurantOpenHour" DROP CONSTRAINT "RestaurantOpenHour_restaurantOpenDayId_fkey";

-- AlterTable
ALTER TABLE "RestaurantOpenHour" DROP COLUMN "end",
DROP COLUMN "restaurantOpenDayId",
DROP COLUMN "start",
ADD COLUMN     "day" "DayOfWeek" NOT NULL,
ADD COLUMN     "endHour" INTEGER NOT NULL,
ADD COLUMN     "endMinute" INTEGER NOT NULL,
ADD COLUMN     "restaurantId" TEXT NOT NULL,
ADD COLUMN     "startHour" INTEGER NOT NULL,
ADD COLUMN     "startMinute" INTEGER NOT NULL;

-- DropTable
DROP TABLE "RestaurantOpenDay";

-- AddForeignKey
ALTER TABLE "RestaurantOpenHour" ADD CONSTRAINT "RestaurantOpenHour_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
