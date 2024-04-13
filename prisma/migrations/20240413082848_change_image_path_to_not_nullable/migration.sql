/*
  Warnings:

  - Made the column `imagePath` on table `Meal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "imagePath" SET NOT NULL;
