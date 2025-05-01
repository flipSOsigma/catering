-- DropForeignKey
ALTER TABLE `customerdetails` DROP FOREIGN KEY `CustomerDetails_order_id_fkey`;

-- DropIndex
DROP INDEX `CustomerDetails_order_id_key` ON `customerdetails`;

-- AddForeignKey
ALTER TABLE `CustomerDetails` ADD CONSTRAINT `CustomerDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;
