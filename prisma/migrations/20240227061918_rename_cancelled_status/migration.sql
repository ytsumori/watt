/*
  Warnings:

  - The values [CANCELED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
ALTER TYPE "OrderStatus" RENAME VALUE 'CANCELED' TO 'CANCELLED';
COMMIT;
