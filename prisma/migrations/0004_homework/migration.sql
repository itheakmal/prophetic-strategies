-- CreateTable
CREATE TABLE `HomeworkSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `title` VARCHAR(240) NOT NULL,
    `sessionLabel` VARCHAR(240) NOT NULL,
    `thoughts` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `HomeworkSubmission_userId_createdAt_idx`(`userId`, `createdAt`),
    INDEX `HomeworkSubmission_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeworkFile` (
    `id` VARCHAR(191) NOT NULL,
    `submissionId` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(480) NOT NULL,
    `storedFileName` VARCHAR(240) NOT NULL,
    `mimeType` VARCHAR(127) NOT NULL,
    `sizeBytes` INTEGER NOT NULL,

    INDEX `HomeworkFile_submissionId_idx`(`submissionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeworkComment` (
    `id` VARCHAR(191) NOT NULL,
    `homeworkId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `body` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HomeworkComment_homeworkId_createdAt_idx`(`homeworkId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HomeworkPin` (
    `userId` VARCHAR(191) NOT NULL,
    `homeworkId` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `HomeworkPin_userId_idx`(`userId`),
    PRIMARY KEY (`userId`, `homeworkId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HomeworkSubmission` ADD CONSTRAINT `HomeworkSubmission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeworkFile` ADD CONSTRAINT `HomeworkFile_submissionId_fkey` FOREIGN KEY (`submissionId`) REFERENCES `HomeworkSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeworkComment` ADD CONSTRAINT `HomeworkComment_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `HomeworkSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeworkComment` ADD CONSTRAINT `HomeworkComment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeworkPin` ADD CONSTRAINT `HomeworkPin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HomeworkPin` ADD CONSTRAINT `HomeworkPin_homeworkId_fkey` FOREIGN KEY (`homeworkId`) REFERENCES `HomeworkSubmission`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
