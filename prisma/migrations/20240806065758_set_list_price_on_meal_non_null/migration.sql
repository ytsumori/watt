/*
  Warnings:

  - Made the column `listPrice` on table `Meal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "listPrice" SET NOT NULL;
