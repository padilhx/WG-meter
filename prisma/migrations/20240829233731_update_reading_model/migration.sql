/*
  Warnings:

  - You are about to drop the column `is_confirmed` on the `Reading` table. All the data in the column will be lost.
  - You are about to alter the column `confirmed_value` on the `Reading` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Reading" DROP COLUMN "is_confirmed",
ADD COLUMN     "has_confirmed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "confirmed_value" SET DATA TYPE INTEGER,
ALTER COLUMN "measure_value" SET DATA TYPE TEXT;
