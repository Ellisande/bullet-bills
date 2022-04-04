/*
  Warnings:

  - Added the required column `amount` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paid` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `site` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "amount" INTEGER NOT NULL,
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "paid" BOOLEAN NOT NULL,
ADD COLUMN     "site" TEXT NOT NULL;
