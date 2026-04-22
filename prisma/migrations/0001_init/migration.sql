-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `passwordHash` VARCHAR(191) NULL,
    `role` ENUM('ADMIN', 'EDITOR') NOT NULL DEFAULT 'EDITOR',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event` (
    `id` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `location` VARCHAR(191) NOT NULL,
    `era` VARCHAR(191) NOT NULL,
    `chronologyOrder` INTEGER NOT NULL DEFAULT 0,
    `context` TEXT NOT NULL,
    `summary` TEXT NOT NULL,
    `deeperPoints` JSON NOT NULL,
    `lessons` JSON NOT NULL,
    `parallels` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Event_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventQuote` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `text` TEXT NOT NULL,
    `source` VARCHAR(191) NOT NULL,
    `details` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventQuote_eventId_sortOrder_idx`(`eventId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventMedia` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `src` VARCHAR(191) NOT NULL,
    `alt` VARCHAR(191) NULL,
    `poster` VARCHAR(191) NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventMedia_eventId_sortOrder_idx`(`eventId`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EventFollowupQuestion` (
    `id` VARCHAR(191) NOT NULL,
    `eventId` VARCHAR(191) NOT NULL,
    `questionType` VARCHAR(191) NOT NULL,
    `prompt` TEXT NOT NULL,
    `inputType` VARCHAR(191) NOT NULL,
    `choices` JSON NOT NULL,
    `correctIndex` INTEGER NOT NULL,
    `explanation` TEXT NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EventFollowupQuestion_eventId_sortOrder_idx`(`eventId`, `sortOrder`),
    UNIQUE INDEX `EventFollowupQuestion_eventId_questionType_key`(`eventId`, `questionType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tribe` (
    `id` VARCHAR(191) NOT NULL,
    `externalId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `group` VARCHAR(191) NOT NULL,
    `phase` VARCHAR(191) NOT NULL DEFAULT 'meccan',
    `x` DOUBLE NOT NULL,
    `y` DOUBLE NOT NULL,
    `lat` DOUBLE NOT NULL,
    `lon` DOUBLE NOT NULL,
    `elders` JSON NULL,
    `chiefs` JSON NULL,
    `refs` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `Tribe_externalId_key`(`externalId`),
    INDEX `Tribe_phase_group_idx`(`phase`, `group`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TribeLink` (
    `id` VARCHAR(191) NOT NULL,
    `sourceTribeId` VARCHAR(191) NOT NULL,
    `targetTribeId` VARCHAR(191) NOT NULL,
    `kind` ENUM('alliance', 'war') NOT NULL,
    `note` VARCHAR(191) NULL,
    `phase` VARCHAR(191) NOT NULL DEFAULT 'meccan',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TribeLink_phase_idx`(`phase`),
    INDEX `TribeLink_sourceTribeId_idx`(`sourceTribeId`),
    INDEX `TribeLink_targetTribeId_idx`(`targetTribeId`),
    UNIQUE INDEX `TribeLink_sourceTribeId_targetTribeId_kind_key`(`sourceTribeId`, `targetTribeId`, `kind`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ContactSubmission` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `subject` VARCHAR(191) NOT NULL,
    `message` TEXT NOT NULL,
    `sourceIp` VARCHAR(191) NULL,
    `userAgent` TEXT NULL,
    `status` ENUM('NEW', 'IN_REVIEW', 'RESOLVED') NOT NULL DEFAULT 'NEW',
    `emailSentAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `ContactSubmission_status_createdAt_idx`(`status`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AuditLog` (
    `id` VARCHAR(191) NOT NULL,
    `actorId` VARCHAR(191) NULL,
    `action` VARCHAR(191) NOT NULL,
    `resource` VARCHAR(191) NOT NULL,
    `resourceId` VARCHAR(191) NULL,
    `payload` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AuditLog_resource_createdAt_idx`(`resource`, `createdAt`),
    INDEX `AuditLog_actorId_createdAt_idx`(`actorId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EventQuote` ADD CONSTRAINT `EventQuote_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventMedia` ADD CONSTRAINT `EventMedia_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EventFollowupQuestion` ADD CONSTRAINT `EventFollowupQuestion_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `Event`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TribeLink` ADD CONSTRAINT `TribeLink_sourceTribeId_fkey` FOREIGN KEY (`sourceTribeId`) REFERENCES `Tribe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TribeLink` ADD CONSTRAINT `TribeLink_targetTribeId_fkey` FOREIGN KEY (`targetTribeId`) REFERENCES `Tribe`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey` FOREIGN KEY (`actorId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

