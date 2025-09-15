/*
  Warnings:

  - The `createdAt` column on the `Nasiya` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `userId` to the `Nasiya` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "firibgar2"."Nasiya" ADD COLUMN     "userId" TEXT NOT NULL,
DROP COLUMN "createdAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "firibgar2"."Nasiya" ADD CONSTRAINT "Nasiya_userId_fkey" FOREIGN KEY ("userId") REFERENCES "firibgar2"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
