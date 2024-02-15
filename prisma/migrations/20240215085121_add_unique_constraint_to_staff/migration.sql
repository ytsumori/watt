/*
  Warnings:

  - A unique constraint covering the columns `[restaurantId,lineId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Staff_restaurantId_lineId_key" ON "Staff"("restaurantId", "lineId");
