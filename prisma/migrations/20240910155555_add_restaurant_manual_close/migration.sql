-- CreateTable
CREATE TABLE "RestaurantManualClose" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "googleMapOpeningHourId" TEXT,
    "holidayOpeningHourId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantManualClose_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_googleMapOpeningHourId_fkey" FOREIGN KEY ("googleMapOpeningHourId") REFERENCES "RestaurantGoogleMapOpeningHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantManualClose" ADD CONSTRAINT "RestaurantManualClose_holidayOpeningHourId_fkey" FOREIGN KEY ("holidayOpeningHourId") REFERENCES "RestaurantHolidayOpeningHour"("id") ON DELETE SET NULL ON UPDATE CASCADE;
