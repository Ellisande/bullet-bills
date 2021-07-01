/*
  Warnings:

  - Added the required column `paidAt` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bill` ADD COLUMN `paidAt` DATETIME(3) NOT NULL;
