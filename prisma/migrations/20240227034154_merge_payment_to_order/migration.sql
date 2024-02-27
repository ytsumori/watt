/*
  Warnings:

  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaypayPaymentCapture` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[paymentProvider,providerPaymentId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentProvider` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerPaymentId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PREAUTHORIZED', 'COMPLETE', 'CANCELED');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropForeignKey
ALTER TABLE "PaypayPaymentCapture" DROP CONSTRAINT "PaypayPaymentCapture_paymentId_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paymentProvider" "PaymentProvider" NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "providerPaymentId" TEXT NOT NULL,
ADD COLUMN     "status" "OrderStatus" NOT NULL DEFAULT 'PREAUTHORIZED';

-- DropTable
DROP TABLE "Payment";

-- DropTable
DROP TABLE "PaypayPaymentCapture";

-- DropEnum
DROP TYPE "PaymentStatus";

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentProvider_providerPaymentId_key" ON "Order"("paymentProvider", "providerPaymentId");
