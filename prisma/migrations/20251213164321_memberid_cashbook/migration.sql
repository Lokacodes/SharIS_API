/*
  Warnings:

  - Added the required column `memberId` to the `Cashbook` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cashbook` ADD COLUMN `memberId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Cashbook` ADD CONSTRAINT `Cashbook_memberId_fkey` FOREIGN KEY (`memberId`) REFERENCES `Member`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
