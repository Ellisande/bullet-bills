/*
  Warnings:

  - The primary key for the `Bill` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_pkey",
ADD PRIMARY KEY ("id");
