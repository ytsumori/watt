/*
  Warnings:

  - You are about to drop the column `status` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "status";

-- DropEnum
DROP TYPE "RestaurantStatus";
