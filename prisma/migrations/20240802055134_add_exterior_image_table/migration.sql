-- CreateTable
CREATE TABLE "RestaurantExteriorImage" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "imagePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantExteriorImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantExteriorImage_restaurantId_key" ON "RestaurantExteriorImage"("restaurantId");

-- AddForeignKey
ALTER TABLE "RestaurantExteriorImage" ADD CONSTRAINT "RestaurantExteriorImage_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
