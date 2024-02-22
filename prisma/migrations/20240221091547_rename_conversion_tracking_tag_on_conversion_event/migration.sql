/*
  Warnings:

  - You are about to drop the column `conversionTrackingTag` on the `ConversionEvent` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `ConversionEvent` table. All the data in the column will be lost.
  - Added the required column `conversionTrackingTagId` to the `ConversionEvent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ConversionEvent" DROP CONSTRAINT "ConversionEvent_conversionTrackingTag_fkey";

-- AlterTable
ALTER TABLE "ConversionEvent" DROP COLUMN "conversionTrackingTag",
DROP COLUMN "updatedAt",
ADD COLUMN     "conversionTrackingTagId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ConversionEvent" ADD CONSTRAINT "ConversionEvent_conversionTrackingTagId_fkey" FOREIGN KEY ("conversionTrackingTagId") REFERENCES "ConversionTrackingTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
