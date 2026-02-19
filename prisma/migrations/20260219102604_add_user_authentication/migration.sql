/*
  Warnings:

  - A unique constraint covering the columns `[restaurant_id,table_id,reservation_date,start_time,customer_phone]` on the table `reservations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TableStatus" ADD VALUE 'OCCUPIED';
ALTER TYPE "TableStatus" ADD VALUE 'RESERVED';

-- AlterTable
ALTER TABLE "reservations" ADD COLUMN     "user_id" INTEGER;

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "reservations_user_id_idx" ON "reservations"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reservations_restaurant_id_table_id_reservation_date_start__key" ON "reservations"("restaurant_id", "table_id", "reservation_date", "start_time", "customer_phone");

-- CreateIndex
CREATE INDEX "restaurants_email_idx" ON "restaurants"("email");

-- AddForeignKey
ALTER TABLE "reservations" ADD CONSTRAINT "reservations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
