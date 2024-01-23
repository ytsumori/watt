/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Restaurant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Restaurant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[googleMapPlaceId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `googleMapPlaceId` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Restaurant_latitude_longitude_key";

-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "imageUrl",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "price",
ADD COLUMN     "googleMapPlaceId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_googleMapPlaceId_key" ON "Restaurant"("googleMapPlaceId");
