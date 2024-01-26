-- CreateTable
CREATE TABLE "StaffRegistrationToken" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "StaffRegistrationToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "StaffRegistrationToken_token_key" ON "StaffRegistrationToken"("token");

-- AddForeignKey
ALTER TABLE "StaffRegistrationToken" ADD CONSTRAINT "StaffRegistrationToken_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
