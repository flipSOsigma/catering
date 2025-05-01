-- CreateTable
CREATE TABLE `OrderData` (
    `unique_id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `updated_at` DATETIME(3) NOT NULL,
    `invitation` INTEGER NOT NULL,
    `visitor` INTEGER NOT NULL,
    `note` VARCHAR(191) NULL,
    `price` INTEGER NOT NULL,
    `portion` INTEGER NOT NULL,

    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CostumerDetails` (
    `unique_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `costumer_name` VARCHAR(191) NOT NULL,
    `costumer_phone` VARCHAR(191) NOT NULL,
    `costumer_email` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `CostumerDetails_order_id_key`(`order_id`),
    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventDetails` (
    `unique_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `event_name` VARCHAR(191) NOT NULL,
    `event_location` VARCHAR(191) NOT NULL,
    `event_date` DATETIME(3) NOT NULL,
    `event_building` VARCHAR(191) NOT NULL,
    `event_category` VARCHAR(191) NOT NULL,
    `event_time` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SectionTable` (
    `unique_id` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `section_name` VARCHAR(191) NOT NULL,
    `section_note` VARCHAR(191) NULL,
    `section_price` INTEGER NOT NULL,
    `section_portion` INTEGER NOT NULL,
    `section_total_price` INTEGER NOT NULL,

    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PortionTable` (
    `unique_id` VARCHAR(191) NOT NULL,
    `section_id` VARCHAR(191) NOT NULL,
    `portion_name` VARCHAR(191) NOT NULL,
    `portion_note` VARCHAR(191) NULL,
    `portion_count` INTEGER NOT NULL,
    `portion_price` INTEGER NOT NULL,
    `portion_total_price` INTEGER NOT NULL,

    PRIMARY KEY (`unique_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CostumerDetails` ADD CONSTRAINT `CostumerDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventDetails` ADD CONSTRAINT `EventDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionTable` ADD CONSTRAINT `SectionTable_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortionTable` ADD CONSTRAINT `PortionTable_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `SectionTable`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;
