-- DropIndex
DROP INDEX "Meal_restaurantId_key";

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "isDiscarded" BOOLEAN NOT NULL DEFAULT false;
