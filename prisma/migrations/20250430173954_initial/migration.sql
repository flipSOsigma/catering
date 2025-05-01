/*
  Warnings:

  - You are about to drop the `costumerdetails` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `costumerdetails` DROP FOREIGN KEY `CostumerDetails_order_id_fkey`;

-- DropTable
DROP TABLE `costumerdetails`;

-- CreateTable
CREATE TABLE `CustomerDetails` (
    `unique_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_phone` VARCHAR(191) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CustomerDetails_order_id_key`(`order_id`),
    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CustomerDetails` ADD CONSTRAINT `CustomerDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;
