-- CreateTable
CREATE TABLE "RestaurantHoliday" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantHoliday_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RestaurantHolidayOpeningHour" (
    "id" TEXT NOT NULL,
    "restaurantHolidayId" TEXT NOT NULL,
    "openHour" INTEGER NOT NULL,
    "openMinute" INTEGER NOT NULL,
    "openDayOfWeek" "DayOfWeek" NOT NULL,
    "closeHour" INTEGER NOT NULL,
    "closeMinute" INTEGER NOT NULL,
    "closeDayOfWeek" "DayOfWeek" NOT NULL,
    "isAutomaticallyApplied" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RestaurantHolidayOpeningHour_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantHolidayOpeningHour_restaurantHolidayId_key" ON "RestaurantHolidayOpeningHour"("restaurantHolidayId");

-- AddForeignKey
ALTER TABLE "RestaurantHoliday" ADD CONSTRAINT "RestaurantHoliday_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RestaurantHolidayOpeningHour" ADD CONSTRAINT "RestaurantHolidayOpeningHour_restaurantHolidayId_fkey" FOREIGN KEY ("restaurantHolidayId") REFERENCES "RestaurantHoliday"("id") ON DELETE CASCADE ON UPDATE CASCADE;
