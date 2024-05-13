-- CreateEnum
CREATE TYPE "OrderNotificationCallStatus" AS ENUM ('IN_PROGRESS', 'ANSWERED', 'NO_ANSWER');

-- CreateTable
CREATE TABLE "OrderNotificationCall" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "callId" TEXT NOT NULL,
    "status" "OrderNotificationCallStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderNotificationCall_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderNotificationCall_orderId_key" ON "OrderNotificationCall"("orderId");

-- AddForeignKey
ALTER TABLE "OrderNotificationCall" ADD CONSTRAINT "OrderNotificationCall_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
