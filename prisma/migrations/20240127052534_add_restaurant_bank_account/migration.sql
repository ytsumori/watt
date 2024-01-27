-- CreateEnum
CREATE TYPE "BankAccountType" AS ENUM ('SAVINGS', 'CHECKING', 'DEPOSIT');

-- CreateTable
CREATE TABLE "RestaurantBankAccount" (
    "id" TEXT NOT NULL,
    "restaurantId" TEXT NOT NULL,
    "bankCode" VARCHAR(4) NOT NULL,
    "branchCode" VARCHAR(3) NOT NULL,
    "accountType" "BankAccountType" NOT NULL,
    "accountNo" TEXT NOT NULL,
    "holderName" TEXT NOT NULL,

    CONSTRAINT "RestaurantBankAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RestaurantBankAccount_bankCode_branchCode_accountType_accou_key" ON "RestaurantBankAccount"("bankCode", "branchCode", "accountType", "accountNo");

-- AddForeignKey
ALTER TABLE "RestaurantBankAccount" ADD CONSTRAINT "RestaurantBankAccount_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
