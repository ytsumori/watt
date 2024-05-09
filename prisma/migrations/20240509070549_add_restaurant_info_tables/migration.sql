-- CreateEnum
CREATE TYPE "PaymentOption" AS ENUM ('CASH', 'CREDIT_CARD', 'E_MONEY', 'QR_CODE');

-- CreateEnum
CREATE TYPE "SmokingOption" AS ENUM ('SMOKING', 'NON_SMOKING', 'SEPARATED', 'SEPARATED_ONLY_E_CIGARETTE');

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "smokingOption" "SmokingOption";

-- CreateTable
CREATE TABLE "RestaurantPaymentOption" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "option" "PaymentOption" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantPaymentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantMenuImage" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "menuNumber" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantMenuImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantPaymentOption_restaurantId_option_key" ON "RestaurantPaymentOption"("restaurantId", "option");

-- AddForeignKey
ALTER TABLE "RestaurantPaymentOption" ADD CONSTRAINT "RestaurantPaymentOption_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantMenuImage" ADD CONSTRAINT "RestaurantMenuImage_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
