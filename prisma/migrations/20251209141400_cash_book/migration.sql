-- CreateTable
CREATE TABLE `Cashbook` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('IN', 'OUT') NOT NULL,
    `module` ENUM('SAVING', 'LOAN', 'INSTALLMENT', 'INCOME', 'EXPENSE') NOT NULL,
    `referenceId` INTEGER NULL,
    `referenceType` ENUM('SAVING', 'LOAN', 'INSTALLMENT') NULL,
    `amount` DECIMAL(12, 2) NOT NULL,
    `balance` DECIMAL(12, 2) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
