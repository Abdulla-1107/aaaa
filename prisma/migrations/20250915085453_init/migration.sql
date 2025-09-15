-- CreateTable
CREATE TABLE "firibgar2"."Nasiya" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "phoneImei" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,
    "passportCode" TEXT NOT NULL,
    "status" TEXT,
    "userImage" TEXT,
    "productImage" TEXT,
    "time" TEXT NOT NULL,
    "createdAt" TEXT NOT NULL,

    CONSTRAINT "Nasiya_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "firibgar2"."Nasiya" ADD CONSTRAINT "Nasiya_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "firibgar2"."Passport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
