-- CreateTable
CREATE TABLE "PaypayCustomer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paypayUserAuthorizationId" TEXT NOT NULL,

    CONSTRAINT "PaypayCustomer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaypayCustomer_userId_key" ON "PaypayCustomer"("userId");

-- AddForeignKey
ALTER TABLE "PaypayCustomer" ADD CONSTRAINT "PaypayCustomer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
