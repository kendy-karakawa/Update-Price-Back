-- CreateTable
CREATE TABLE `Product` (
    `code` BIGINT NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `cost_price` DECIMAL(9, 2) NOT NULL,
    `sales_price` DECIMAL(9, 2) NOT NULL,

    PRIMARY KEY (`code`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pack` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `pack_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL,
    `qty` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pack` ADD CONSTRAINT `Pack_pack_id_fkey` FOREIGN KEY (`pack_id`) REFERENCES `Product`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pack` ADD CONSTRAINT `Pack_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `Product`(`code`) ON DELETE RESTRICT ON UPDATE CASCADE;
