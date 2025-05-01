/*
  Warnings:

  - You are about to drop the `customerdetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eventdetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `orderdata` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `portiontable` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sectiontable` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `customerdetails` DROP FOREIGN KEY `CustomerDetails_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventdetails` DROP FOREIGN KEY `EventDetails_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `portiontable` DROP FOREIGN KEY `PortionTable_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `sectiontable` DROP FOREIGN KEY `SectionTable_order_id_fkey`;

-- DropTable
DROP TABLE `customerdetails`;

-- DropTable
DROP TABLE `eventdetails`;

-- DropTable
DROP TABLE `orderdata`;

-- DropTable
DROP TABLE `portiontable`;

-- DropTable
DROP TABLE `sectiontable`;

-- CreateTable
CREATE TABLE `order_data` (
    `unique_id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `invitation` INTEGER NOT NULL,
    `visitor` INTEGER NOT NULL,
    `note` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `portion` INTEGER NOT NULL,
    `customerId` VARCHAR(191) NULL,
    `eventId` VARCHAR(191) NULL,

    UNIQUE INDEX `order_data_customerId_key`(`customerId`),
    UNIQUE INDEX `order_data_eventId_key`(`eventId`),
    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `customer_details` (
    `id` VARCHAR(191) NOT NULL,
    `customer_name` VARCHAR(191) NOT NULL,
    `customer_phone` VARCHAR(191) NOT NULL,
    `customer_email` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `event_details` (
    `id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NOT NULL,
    `event_location` VARCHAR(191) NOT NULL,
    `event_date` DATETIME(3) NOT NULL,
    `event_building` VARCHAR(191) NOT NULL,
    `event_category` VARCHAR(191) NOT NULL,
    `event_time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `section_table` (
    `id` VARCHAR(191) NOT NULL,
    `section_name` VARCHAR(191) NOT NULL,
    `section_note` VARCHAR(191) NOT NULL,
    `section_price` INTEGER NOT NULL,
    `section_portion` INTEGER NOT NULL,
    `section_total_price` INTEGER NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `portion_table` (
    `id` VARCHAR(191) NOT NULL,
    `portion_name` VARCHAR(191) NOT NULL,
    `portion_note` VARCHAR(191) NOT NULL,
    `portion_count` INTEGER NOT NULL,
    `portion_price` INTEGER NOT NULL,
    `portion_total_price` INTEGER NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order_data` ADD CONSTRAINT `order_data_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `customer_details`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_data` ADD CONSTRAINT `order_data_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `event_details`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `section_table` ADD CONSTRAINT `section_table_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_data`(`unique_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `portion_table` ADD CONSTRAINT `portion_table_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `section_table`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
