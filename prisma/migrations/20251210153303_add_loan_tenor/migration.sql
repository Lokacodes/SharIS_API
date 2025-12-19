/*
  Warnings:

  - Added the required column `loanTenor` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `loan` ADD COLUMN `loanTenor` INTEGER NOT NULL;
