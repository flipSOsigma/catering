-- DropForeignKey
ALTER TABLE `customerdetails` DROP FOREIGN KEY `CustomerDetails_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `eventdetails` DROP FOREIGN KEY `EventDetails_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `portiontable` DROP FOREIGN KEY `PortionTable_section_id_fkey`;

-- DropForeignKey
ALTER TABLE `sectiontable` DROP FOREIGN KEY `SectionTable_order_id_fkey`;

-- DropIndex
DROP INDEX `CustomerDetails_order_id_fkey` ON `customerdetails`;

-- DropIndex
DROP INDEX `EventDetails_order_id_fkey` ON `eventdetails`;

-- DropIndex
DROP INDEX `PortionTable_section_id_fkey` ON `portiontable`;

-- DropIndex
DROP INDEX `SectionTable_order_id_fkey` ON `sectiontable`;
