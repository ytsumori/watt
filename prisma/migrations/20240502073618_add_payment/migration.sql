/*
  Warnings:

  - You are about to drop the column `taskId` on the `Order` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Order_providerPaymentId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "taskId",
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "providerPaymentId" DROP NOT NULL,
ALTER COLUMN "restaurantProfitPrice" DROP NOT NULL;

-- CreateTable
CREATE TABLE "OrderAutomaticCancellation" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "googleCloudTaskId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderAutomaticCancellation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "additionalAmount" INTEGER NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "restaurantProfitPrice" INTEGER NOT NULL,
    "isCsvDownloaded" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderAutomaticCancellation_orderId_key" ON "OrderAutomaticCancellation"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "OrderAutomaticCancellation" ADD CONSTRAINT "OrderAutomaticCancellation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
