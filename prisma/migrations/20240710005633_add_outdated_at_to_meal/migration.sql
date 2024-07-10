-- Rename the column
ALTER TABLE "Meal" RENAME COLUMN "isDiscarded" TO "isInactive";

-- Add the new column
ALTER TABLE "Meal" ADD COLUMN "outdatedAt" TIMESTAMP(3);
