-- CreateTable
CREATE TABLE "firibgar2"."User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firibgar2"."Fraudster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "passportId" TEXT NOT NULL,
    "passportCode" TEXT NOT NULL,
    "location" TEXT,
    "description" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Fraudster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "firibgar2"."Passport" (
    "id" TEXT NOT NULL,
    "series" TEXT NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passport_series_key" ON "firibgar2"."Passport"("series");

-- AddForeignKey
ALTER TABLE "firibgar2"."Fraudster" ADD CONSTRAINT "Fraudster_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "firibgar2"."Passport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "firibgar2"."Fraudster" ADD CONSTRAINT "Fraudster_userId_fkey" FOREIGN KEY ("userId") REFERENCES "firibgar2"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
