-- CreateTable
CREATE TABLE "RestaurantGoogleMapPlaceInfo" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "latitude" DECIMAL(65,30) NOT NULL,
    "longitude" DECIMAL(65,30) NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantGoogleMapPlaceInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantGoogleMapOpeningHours" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "dayOfWeek" "DayOfWeek" NOT NULL,
    "openHour" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "closeHour" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantGoogleMapOpeningHours_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantGoogleMapPlaceInfo_restaurantId_key" ON "RestaurantGoogleMapPlaceInfo"("restaurantId");

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantGoogleMapOpeningHours_restaurantId_key" ON "RestaurantGoogleMapOpeningHours"("restaurantId");

-- AddForeignKey
ALTER TABLE "RestaurantGoogleMapPlaceInfo" ADD CONSTRAINT "RestaurantGoogleMapPlaceInfo_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantGoogleMapOpeningHours" ADD CONSTRAINT "RestaurantGoogleMapOpeningHours_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
