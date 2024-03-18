/*
  Warnings:

  - You are about to drop the column `paymentProvider` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `PaypayCustomer` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[providerPaymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PaypayCustomer" DROP CONSTRAINT "PaypayCustomer_userId_fkey";

-- DropIndex
DROP INDEX "Order_paymentProvider_providerPaymentId_key";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paymentProvider";

-- DropTable
DROP TABLE "PaypayCustomer";

-- DropEnum
DROP TYPE "PaymentProvider";

-- CreateIndex
CREATE UNIQUE INDEX "Order_providerPaymentId_key" ON "Order"("providerPaymentId");
