/*
  Warnings:

  - You are about to drop the column `description` on the `Fraudster` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Fraudster` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Fraudster` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Fraudster" DROP COLUMN "description",
DROP COLUMN "image",
DROP COLUMN "location",
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "surname" DROP NOT NULL;
