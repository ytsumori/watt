-- CreateTable
CREATE TABLE "RestaurantCoordinates" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "point" geometry(POINT,4326),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantCoordinates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantCoordinates_restaurantId_key" ON "RestaurantCoordinates"("restaurantId");

-- AddForeignKey
ALTER TABLE "RestaurantCoordinates" ADD CONSTRAINT "RestaurantCoordinates_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
