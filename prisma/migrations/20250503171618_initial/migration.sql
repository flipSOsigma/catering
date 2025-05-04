-- DropForeignKey
ALTER TABLE `section_table` DROP FOREIGN KEY `section_table_order_id_fkey`;

-- DropIndex
DROP INDEX `section_table_order_id_fkey` ON `section_table`;

-- AlterTable
ALTER TABLE `portion_table` MODIFY `section_id` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `section_table` MODIFY `order_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `section_table` ADD CONSTRAINT `section_table_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order_data`(`unique_id`) ON DELETE SET NULL ON UPDATE CASCADE;
