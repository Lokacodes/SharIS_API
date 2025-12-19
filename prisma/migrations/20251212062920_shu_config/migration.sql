-- CreateTable
CREATE TABLE `SHUConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tahun` INTEGER NOT NULL,
    `danaCadangan` DECIMAL(5, 2) NOT NULL,
    `jasaModal` DECIMAL(5, 2) NOT NULL,
    `jasaUsaha` DECIMAL(5, 2) NOT NULL,
    `danaSosial` DECIMAL(5, 2) NOT NULL,
    `pengurus` DECIMAL(5, 2) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
