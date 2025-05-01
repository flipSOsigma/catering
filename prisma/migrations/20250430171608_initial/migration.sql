/*
  Warnings:

  - You are about to drop the column `costumer_email` on the `costumerdetails` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_name` on the `costumerdetails` table. All the data in the column will be lost.
  - You are about to drop the column `costumer_phone` on the `costumerdetails` table. All the data in the column will be lost.
  - Added the required column `customer_email` to the `CostumerDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_name` to the `CostumerDetails` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_phone` to the `CostumerDetails` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `costumerdetails` DROP COLUMN `costumer_email`,
    DROP COLUMN `costumer_name`,
    DROP COLUMN `costumer_phone`,
    ADD COLUMN `customer_email` VARCHAR(191) NOT NULL,
    ADD COLUMN `customer_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `customer_phone` VARCHAR(191) NOT NULL;
