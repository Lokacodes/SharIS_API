/*
  Warnings:

  - You are about to drop the column `danaCadangan` on the `shuconfig` table. All the data in the column will be lost.
  - You are about to drop the column `danaSosial` on the `shuconfig` table. All the data in the column will be lost.
  - You are about to drop the column `jasaModal` on the `shuconfig` table. All the data in the column will be lost.
  - You are about to drop the column `jasaUsaha` on the `shuconfig` table. All the data in the column will be lost.
  - You are about to drop the column `pengurus` on the `shuconfig` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `shuconfig` DROP COLUMN `danaCadangan`,
    DROP COLUMN `danaSosial`,
    DROP COLUMN `jasaModal`,
    DROP COLUMN `jasaUsaha`,
    DROP COLUMN `pengurus`;

-- CreateTable
CREATE TABLE `SHUConfigItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shuConfigId` INTEGER NOT NULL,
    `key` VARCHAR(191) NOT NULL,
    `percent` DECIMAL(5, 2) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SHUConfigItem` ADD CONSTRAINT `SHUConfigItem_shuConfigId_fkey` FOREIGN KEY (`shuConfigId`) REFERENCES `SHUConfig`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
