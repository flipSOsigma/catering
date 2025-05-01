/*
  Warnings:

  - A unique constraint covering the columns `[order_id]` on the table `CustomerDetails` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[order_id]` on the table `EventDetails` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `CustomerDetails_order_id_key` ON `CustomerDetails`(`order_id`);

-- CreateIndex
CREATE UNIQUE INDEX `EventDetails_order_id_key` ON `EventDetails`(`order_id`);

-- AddForeignKey
ALTER TABLE `CustomerDetails` ADD CONSTRAINT `CustomerDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventDetails` ADD CONSTRAINT `EventDetails_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SectionTable` ADD CONSTRAINT `SectionTable_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `OrderData`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PortionTable` ADD CONSTRAINT `PortionTable_section_id_fkey` FOREIGN KEY (`section_id`) REFERENCES `SectionTable`(`unique_id`) ON DELETE CASCADE ON UPDATE CASCADE;
