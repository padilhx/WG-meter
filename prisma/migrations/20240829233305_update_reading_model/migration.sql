/*
  Warnings:

  - You are about to drop the column `has_confirmed` on the `Reading` table. All the data in the column will be lost.
  - The `measure_value` column on the `Reading` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Reading" DROP COLUMN "has_confirmed",
ADD COLUMN     "is_confirmed" BOOLEAN NOT NULL DEFAULT false,
DROP COLUMN "measure_value",
ADD COLUMN     "measure_value" DOUBLE PRECISION,
ALTER COLUMN "confirmed_value" SET DATA TYPE DOUBLE PRECISION;
