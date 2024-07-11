-- AlterTable
ALTER TABLE "RestaurantCoordinate" RENAME CONSTRAINT "RestaurantCoordinates_pkey" TO "RestaurantCoordinate_pkey";

-- RenameForeignKey
ALTER TABLE "RestaurantCoordinate" RENAME CONSTRAINT "RestaurantCoordinates_restaurantId_fkey" TO "RestaurantCoordinate_restaurantId_fkey";

-- RenameIndex
ALTER INDEX "RestaurantCoordinates_restaurantId_key" RENAME TO "RestaurantCoordinate_restaurantId_key";
