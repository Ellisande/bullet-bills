/*
  Warnings:

  - Added the required column `amount` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dueDate` to the `Bill` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Bill` ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `dueDate` DATETIME(3) NOT NULL,
    ADD COLUMN `frequency` VARCHAR(191) NOT NULL DEFAULT 'monthly',
    ADD COLUMN `name` VARCHAR(191) NOT NULL,
    ADD COLUMN `paid` BOOLEAN NOT NULL DEFAULT false;
