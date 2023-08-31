/*
MySQL Backup
Database: uu
Backup Time: 2023-08-31 13:48:42
*/

SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `uu`.`card`;
DROP TABLE IF EXISTS `uu`.`charge`;
DROP TABLE IF EXISTS `uu`.`menu`;
DROP TABLE IF EXISTS `uu`.`orders`;
DROP TABLE IF EXISTS `uu`.`payrecord`;
DROP TABLE IF EXISTS `uu`.`record`;
DROP TABLE IF EXISTS `uu`.`scanrecord`;
DROP TABLE IF EXISTS `uu`.`user`;
CREATE TABLE `card` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `balance` int(11) DEFAULT NULL,
  `time` datetime NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='电卡表';
CREATE TABLE `charge` (
  `id` bigint(16) NOT NULL AUTO_INCREMENT,
  `station_name` varchar(255) NOT NULL COMMENT '充电桩名',
  `location` varchar(255) NOT NULL COMMENT '充电桩位置',
  `status` varchar(255) NOT NULL COMMENT '充电桩状态0未使用1正在使用2占用3故障维修',
  `type` varchar(255) NOT NULL COMMENT '充电桩类型',
  `power` int(11) NOT NULL COMMENT '充电桩功率',
  `price` decimal(10,2) NOT NULL COMMENT '充电桩价格',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=545848578545546 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='充电桩表';
CREATE TABLE `menu` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL COMMENT '菜单名称',
  `description` varchar(255) NOT NULL COMMENT '菜单描述',
  `parentId` int(11) NOT NULL COMMENT '父级ID',
  `link` varchar(255) NOT NULL COMMENT '路由',
  `icon` varchar(255) NOT NULL COMMENT '图标',
  `sortOrder` varchar(255) NOT NULL COMMENT '菜单项是否对用户可见',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='菜单表';
CREATE TABLE `orders` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `station_id` int(11) DEFAULT NULL COMMENT '电卡ID',
  `card_id` int(11) DEFAULT NULL COMMENT '充电桩ID',
  `time` datetime DEFAULT current_timestamp() COMMENT '订单创建时间',
  `status` varchar(255) NOT NULL DEFAULT '1' COMMENT '订单状态0 代表已取消订单，1 代表正在进行的订单，2 代表已完成订单，3 代表已退款的订单',
  `amount` decimal(10,2) DEFAULT NULL COMMENT '订单金额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='订单表';
CREATE TABLE `payrecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `order_id` int(11) DEFAULT NULL COMMENT '订单ID',
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `pay_time` datetime DEFAULT current_timestamp() COMMENT '支付时间',
  `pay_methed` varchar(255) DEFAULT NULL COMMENT '支付方式0余额1微信',
  `amount` decimal(10,2) DEFAULT NULL COMMENT '支付金额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='支付记录表';
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `station_id` int(11) DEFAULT NULL COMMENT '充电桩ID',
  `order_id` int(11) DEFAULT NULL COMMENT '订单号',
  `start_time` datetime DEFAULT current_timestamp() COMMENT '充电开始时间',
  `end_time` datetime DEFAULT NULL COMMENT '充电结束时间',
  `duration` int(11) DEFAULT NULL COMMENT '充电时长',
  `status_tytpe` int(11) NOT NULL DEFAULT 0 COMMENT '状态',
  `cost` decimal(10,2) DEFAULT NULL COMMENT '充电费用',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT=' 充电记录表';
CREATE TABLE `scanrecord` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL COMMENT '用户ID',
  `station_id` int(11) DEFAULT NULL COMMENT '充电桩ID',
  `time` datetime DEFAULT NULL COMMENT '扫码时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='扫码记录表';
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL COMMENT '用户名',
  `pwd` varchar(128) NOT NULL COMMENT '登录密码',
  `mobile` varchar(128) NOT NULL COMMENT '手机号',
  `avatar` varchar(200) DEFAULT NULL COMMENT '用户微信头像',
  `gender` int(11) NOT NULL COMMENT '性别',
  `creat_time` datetime(6) NOT NULL DEFAULT current_timestamp(6) COMMENT '创建时间',
  `openid` varchar(50) NOT NULL COMMENT '微信openid',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';
BEGIN;
LOCK TABLES `uu`.`card` WRITE;
DELETE FROM `uu`.`card`;
INSERT INTO `uu`.`card` (`id`,`user_id`,`balance`,`time`) VALUES (1, 4, 1, '2023-08-28 16:07:06');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`charge` WRITE;
DELETE FROM `uu`.`charge`;
INSERT INTO `uu`.`charge` (`id`,`station_name`,`location`,`status`,`type`,`power`,`price`) VALUES (1, '一号充电桩', '京科花园', '0', 'typeC', 500, 10.00),(2, '二号充电桩', '京科花园', '1', 'iphone', 500, 10.00),(3, '三号充电桩', '京科花园', '2', '电车通用', 500, 10.00),(4, '四号充电桩', '京科花园', '3', '通用', 500, 10.00),(545848578545545, '五号充电桩', '京科花园', '0', '通用接口', 500, 10.00);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`menu` WRITE;
DELETE FROM `uu`.`menu`;
INSERT INTO `uu`.`menu` (`id`,`name`,`description`,`parentId`,`link`,`icon`,`sortOrder`) VALUES (0, '充电记录', '充电记录', 0, '/record', 'record', '0'),(1, '充电桩', '充电桩', 1, '/charging', 'charging', '1'),(2, '关于我们', '关于我们', 2, '/aboutUs', 'vite', '2'),(3, '充值记录', '充值记录', 3, '/record', 'record', '3'),(4, '电卡充值', '电卡充值', 4, '/recharge', 'recharge', '4'),(5, '常见问题', '常见问题', 5, '/problem', 'problem', '5'),(6, '报修记录', '报修记录', 6, '/repaiReport', 'repaiReport', '6');
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`orders` WRITE;
DELETE FROM `uu`.`orders`;
INSERT INTO `uu`.`orders` (`id`,`user_id`,`station_id`,`card_id`,`time`,`status`,`amount`) VALUES (1, 4, 0, 0, NULL, '2', 10.00),(19, 4, 0, 0, '2023-08-23 20:04:31', '2', 10.00),(20, 4, 0, 0, '2023-08-24 16:09:27', '2', 10.00),(21, 4, 0, 0, '2023-08-25 18:53:34', '2', 10.00),(22, 4, 0, 0, '2023-08-25 18:55:03', '2', 10.00),(23, 4, 2147483647, NULL, '2023-08-26 15:30:41', '2', 0.00),(24, 4, 2147483647, NULL, '2023-08-26 15:35:45', '2', 0.00),(25, 4, 2147483647, NULL, '2023-08-26 15:37:02', '2', 0.00),(26, 4, 2147483647, NULL, '2023-08-26 15:38:14', '2', 0.00),(27, 4, 2147483647, NULL, '2023-08-26 16:32:00', '2', 0.00),(28, 4, 2147483647, NULL, '2023-08-26 16:53:59', '2', 0.00),(29, 4, 2147483647, NULL, '2023-08-26 17:06:39', '2', 0.00),(30, 4, 2147483647, NULL, '2023-08-26 17:12:21', '2', 0.00),(31, 4, 2147483647, NULL, '2023-08-28 12:38:12', '2', 0.00),(32, 4, 2147483647, NULL, '2023-08-28 15:26:05', '2', 0.00),(33, 4, 2147483647, NULL, '2023-08-28 15:59:27', '2', 60.00),(34, 4, 2147483647, NULL, '2023-08-28 16:55:37', '2', 60.00),(35, 4, 2147483647, NULL, '2023-08-28 17:06:14', '2', 60.00),(36, 4, 2147483647, NULL, '2023-08-28 17:11:18', '2', 60.00),(37, 4, 2147483647, NULL, '2023-08-28 17:14:07', '2', 60.00),(40, 4, 2147483647, NULL, '2023-08-28 17:25:58', '2', 60.00),(42, 4, 2147483647, NULL, '2023-08-28 17:40:33', '2', 60.00),(43, 4, 2147483647, NULL, '2023-08-28 17:43:45', '2', 60.00),(44, 4, 2147483647, NULL, '2023-08-28 18:54:35', '2', 60.00),(45, 4, 2147483647, NULL, '2023-08-29 09:53:20', '2', 60.00),(46, 4, 1, NULL, '2023-08-29 11:49:55', '2', 60.00),(47, 4, 2147483647, NULL, '2023-08-29 13:53:55', '2', 1.00),(48, 4, 2147483647, NULL, '2023-08-29 14:00:33', '2', 60.00),(49, 4, 2147483647, NULL, '2023-08-29 19:54:29', '2', 60.00),(50, 4, 2147483647, NULL, '2023-08-29 19:55:02', '2', 1.00);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`payrecord` WRITE;
DELETE FROM `uu`.`payrecord`;
INSERT INTO `uu`.`payrecord` (`id`,`order_id`,`user_id`,`pay_time`,`pay_methed`,`amount`) VALUES (1, 40, 4, '2023-08-28 17:26:39', '0', 60.00),(2, 42, 4, '2023-08-28 17:40:33', '0', 60.00),(3, 43, 4, '2023-08-28 17:43:45', '0', 60.00),(4, 44, 4, '2023-08-28 18:54:35', '0', 60.00),(5, 45, 4, '2023-08-29 09:53:20', '0', 60.00),(6, 46, 4, '2023-08-29 11:49:55', '0', 60.00),(7, 47, 4, '2023-08-29 13:53:55', '0', 1.00),(8, 48, 4, '2023-08-29 14:00:33', '0', 60.00),(9, 49, 4, '2023-08-29 19:54:29', '0', 60.00),(10, 50, 4, '2023-08-29 19:55:02', '0', 1.00);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`record` WRITE;
DELETE FROM `uu`.`record`;
INSERT INTO `uu`.`record` (`id`,`user_id`,`station_id`,`order_id`,`start_time`,`end_time`,`duration`,`status_tytpe`,`cost`) VALUES (10, 4, 2147483647, 27, '2023-08-26 16:32:00', '2023-08-26 16:33:00', 1, 0, 1.00),(11, 4, 2147483647, 28, '2023-08-26 16:53:59', '2023-08-26 16:54:59', 1, 0, 1.00),(12, 4, 2147483647, 29, '2023-08-26 17:06:39', '2023-08-26 17:07:39', 1, 0, 1.00),(13, 4, 2147483647, 30, '2023-08-26 17:12:21', '2023-08-26 17:13:21', 1, 0, 1.00),(14, 4, 2147483647, 31, '2023-08-28 12:38:12', '2023-08-28 12:39:12', 1, 0, 1.00),(15, 4, 2147483647, 32, '2023-08-28 15:26:05', '2023-08-28 16:26:05', 60, 0, 60.00),(16, 4, 2147483647, 33, '2023-08-28 15:59:27', '2023-08-28 16:59:27', 60, 0, 60.00),(17, 4, 2147483647, 34, '2023-08-28 16:55:37', '2023-08-28 17:55:37', 60, 0, 60.00),(18, 4, 2147483647, 35, '2023-08-28 17:06:14', '2023-08-28 18:06:14', 60, 0, 60.00),(19, 4, 2147483647, 36, '2023-08-28 17:11:18', '2023-08-28 18:11:18', 60, 0, 60.00),(20, 4, 2147483647, 37, '2023-08-28 17:14:07', '2023-08-28 18:14:07', 60, 0, 60.00),(21, 4, 2147483647, 40, '2023-08-28 17:25:58', '2023-08-28 18:25:58', 60, 0, 60.00),(22, 4, 2147483647, 42, '2023-08-28 17:40:33', '2023-08-28 18:40:33', 60, 0, 60.00),(23, 4, 2147483647, 43, '2023-08-28 17:43:45', '2023-08-28 18:43:45', 60, 0, 60.00),(24, 4, 2147483647, 44, '2023-08-28 18:54:35', '2023-08-28 19:54:35', 60, 0, 60.00),(25, 4, 2147483647, 45, '2023-08-29 09:53:20', '2023-08-29 10:53:20', 60, 0, 60.00),(26, 4, 1, 46, '2023-08-29 11:49:55', '2023-08-29 12:49:55', 60, 0, 60.00),(27, 4, 2147483647, 47, '2023-08-29 13:53:55', '2023-08-29 13:54:55', 1, 0, 1.00),(28, 4, 2147483647, 48, '2023-08-29 14:00:33', '2023-08-29 15:00:33', 60, 0, 60.00),(29, 4, 2147483647, 49, '2023-08-29 19:54:29', '2023-08-29 20:54:29', 60, 0, 60.00),(30, 4, 2147483647, 50, '2023-08-29 19:55:02', '2023-08-29 19:56:02', 1, 0, 1.00);
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`scanrecord` WRITE;
DELETE FROM `uu`.`scanrecord`;
UNLOCK TABLES;
COMMIT;
BEGIN;
LOCK TABLES `uu`.`user` WRITE;
DELETE FROM `uu`.`user`;
INSERT INTO `uu`.`user` (`id`,`name`,`pwd`,`mobile`,`avatar`,`gender`,`creat_time`,`openid`) VALUES (4, '迪迦', '', '', 'https://thirdwx.qlogo.cn/mmopen/vi_32/lU4libeGx9m9GytKibFLg0b8U7HVfcUUSy4ryxxS3sicQhOVnwzw8DZI7yZuNqLU3Ggg6qAZKtsaqTcn7o0YzbTpw/132', 0, '2023-08-21 17:54:09.367290', 'oWVwb5CioKYCBN5687EQsAp4WStE');
UNLOCK TABLES;
COMMIT;
