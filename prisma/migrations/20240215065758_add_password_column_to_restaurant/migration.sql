/*
  Warnings:

  - You are about to drop the `StaffRegistrationToken` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[password]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "StaffRegistrationToken" DROP CONSTRAINT "StaffRegistrationToken_restaurantId_fkey";

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "StaffRegistrationToken";

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_password_key" ON "Restaurant"("password");
