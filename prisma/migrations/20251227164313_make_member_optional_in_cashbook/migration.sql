-- DropForeignKey
ALTER TABLE `cashbook` DROP FOREIGN KEY `Cashbook_memberId_fkey`;

-- DropIndex
DROP INDEX `Cashbook_memberId_fkey` ON `cashbook`;

-- AlterTable
ALTER TABLE `cashbook` MODIFY `memberId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Cashbook` ADD CONSTRAINT `Cashbook_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
