/*
  Warnings:

  - You are about to drop the column `completedAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `OrderAutomaticCancellation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrderAutomaticCancellation" DROP CONSTRAINT "OrderAutomaticCancellation_orderId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "completedAt";

-- DropTable
DROP TABLE "OrderAutomaticCancellation";
