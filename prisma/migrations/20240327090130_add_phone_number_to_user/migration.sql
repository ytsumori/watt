/*
  Warnings:

  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phoneNumber" TEXT;

-- DropTable
DROP TABLE "VerificationToken";

-- CreateTable
CREATE TABLE "OneTimePassword" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "code" VARCHAR(6) NOT NULL,

    CONSTRAINT "OneTimePassword_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OneTimePassword_phoneNumber_key" ON "OneTimePassword"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "User_phoneNumber_key" ON "User"("phoneNumber");
