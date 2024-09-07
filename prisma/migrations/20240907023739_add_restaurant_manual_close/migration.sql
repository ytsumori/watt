-- CreateTable
CREATE TABLE "RestaurantManualClose" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "restaurantGoogleMapOpeningHourId" TEXT,
    "restaurantHolidayOpeningHourId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantManualClose_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_restaurantGoogleMapOpeningHourId_fkey" FOREIGN KEY ("restaurantGoogleMapOpeningHourId") REFERENCES "RestaurantGoogleMapOpeningHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_restaurantHolidayOpeningHourId_fkey" FOREIGN KEY ("restaurantHolidayOpeningHourId") REFERENCES "RestaurantHolidayOpeningHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
