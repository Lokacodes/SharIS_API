/*
  Warnings:

  - You are about to drop the column `loanTenor` on the `loan` table. All the data in the column will be lost.
  - Added the required column `tenorOptionId` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `servicePercentage` to the `TenorOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` DROP COLUMN `loanTenor`,
    ADD COLUMN `tenorOptionId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `tenoroption` ADD COLUMN `servicePercentage` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Loan` ADD CONSTRAINT `Loan_tenorOptionId_fkey` FOREIGN KEY (`tenorOptionId`) REFERENCES `TenorOption`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
