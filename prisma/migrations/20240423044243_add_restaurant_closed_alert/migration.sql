-- CreateTable
CREATE TABLE "RestaurantClosedAlert" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "closedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notifiedAt" TIMESTAMP(3),
    "openAt" TIMESTAMP(3),

    CONSTRAINT "RestaurantClosedAlert_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantClosedAlert" ADD CONSTRAINT "RestaurantClosedAlert_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
