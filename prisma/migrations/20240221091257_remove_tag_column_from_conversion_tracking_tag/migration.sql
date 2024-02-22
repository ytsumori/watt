/*
  Warnings:

  - You are about to drop the column `tag` on the `ConversionTrackingTag` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "ConversionTrackingTag_tag_key";

-- AlterTable
ALTER TABLE "ConversionTrackingTag" DROP COLUMN "tag";
