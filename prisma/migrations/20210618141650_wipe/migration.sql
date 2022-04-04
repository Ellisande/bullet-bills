/*
  Warnings:

  - You are about to drop the column `amount` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `frequency` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `paid` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `site` on the `Bill` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "amount",
DROP COLUMN "dueDate",
DROP COLUMN "frequency",
DROP COLUMN "name",
DROP COLUMN "paid",
DROP COLUMN "site";
