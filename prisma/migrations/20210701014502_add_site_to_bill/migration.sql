/*
  Warnings:

  - Added the required column `site` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bill` ADD COLUMN `site` VARCHAR(191) NOT NULL;
