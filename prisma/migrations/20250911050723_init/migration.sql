/*
  Warnings:

  - Made the column `image` on table `Fraudster` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Fraudster" ALTER COLUMN "image" SET NOT NULL,
ALTER COLUMN "location" DROP NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;
