-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fraudster" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "image" TEXT,
    "passportId" TEXT NOT NULL,
    "passportCode" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Fraudster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Passport" (
    "id" TEXT NOT NULL,
    "series" TEXT NOT NULL,

    CONSTRAINT "Passport_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Passport_series_key" ON "public"."Passport"("series");

-- AddForeignKey
ALTER TABLE "public"."Fraudster" ADD CONSTRAINT "Fraudster_passportId_fkey" FOREIGN KEY ("passportId") REFERENCES "public"."Passport"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
