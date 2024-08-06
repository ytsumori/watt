/*
  Warnings:

  - You are about to drop the `RestaurantFullStatus` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RestaurantStatus" AS ENUM ('OPEN', 'PACKED', 'CLOSED');

-- DropForeignKey
ALTER TABLE "RestaurantFullStatus" DROP CONSTRAINT "RestaurantFullStatus_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "status" "RestaurantStatus" NOT NULL DEFAULT 'CLOSED';

-- DropTable
DROP TABLE "RestaurantFullStatus";

-- CreateTable
CREATE TABLE "RestaurantStatusChange" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "from" "RestaurantStatus" NOT NULL,
    "to" "RestaurantStatus" NOT NULL,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantStatusChange_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantStatusChange" ADD CONSTRAINT "RestaurantStatusChange_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
