/*
  Warnings:

  - Made the column `password` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "password" SET NOT NULL;
