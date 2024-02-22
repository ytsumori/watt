/*
  Warnings:

  - You are about to drop the `ConversionEvent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ConversionTrackingTag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ConversionEvent" DROP CONSTRAINT "ConversionEvent_conversionTrackingTagId_fkey";

-- DropTable
DROP TABLE "ConversionEvent";

-- DropTable
DROP TABLE "ConversionTrackingTag";
