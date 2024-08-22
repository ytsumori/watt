/*
  Warnings:

  - A unique constraint covering the columns `[no]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "no" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_no_key" ON "Restaurant"("no");
