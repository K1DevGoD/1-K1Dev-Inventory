
ALTER TABLE `items`
ADD COLUMN IF NOT EXISTS `desc` TEXT NULL;

CREATE TABLE IF NOT EXISTS `inventories` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `identifier` text DEFAULT NULL,
  `type` varchar(50) DEFAULT NULL,
  `data` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;

ALTER TABLE `inventories` MODIFY COLUMN `identifier` TEXT;

