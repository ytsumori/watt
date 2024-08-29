/*
  Warnings:

  - You are about to drop the column `isDiscounted` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `isFullStatusAvailable` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the `RestaurantStatusChange` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RestaurantStatusChange" DROP CONSTRAINT "RestaurantStatusChange_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "isDiscounted";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "isFullStatusAvailable",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- DropTable
DROP TABLE "RestaurantStatusChange";
