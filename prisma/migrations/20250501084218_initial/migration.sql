-- DropForeignKey
ALTER TABLE `portion_table` DROP FOREIGN KEY `portion_table_section_id_fkey`;

-- DropIndex
DROP INDEX `portion_table_section_id_fkey` ON `portion_table`;

-- AddForeignKey
ALTER TABLE `portion_table` ADD CONSTRAINT `portion_table_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `section_table`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
