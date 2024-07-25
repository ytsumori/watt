-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "listPrice" INTEGER;

-- AlterTable
ALTER TABLE "MealItem" ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "isFullStatusAvailable" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "RestaurantFullStatus" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "easedAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantFullStatus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantFullStatus" ADD CONSTRAINT "RestaurantFullStatus_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
