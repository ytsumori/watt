/*
  Warnings:

  - You are about to alter the column `latitude` on the `RestaurantGoogleMapPlaceInfo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `RestaurantGoogleMapPlaceInfo` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "RestaurantGoogleMapPlaceInfo" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;
