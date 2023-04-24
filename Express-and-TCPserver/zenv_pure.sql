-- MySQL dump 10.13  Distrib 8.0.32, for macos13 (arm64)
--
-- Host: localhost    Database: zenv
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `prog_lang_services`
--

DROP TABLE IF EXISTS `prog_lang_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prog_lang_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `project_name` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL,
  `service_item` int NOT NULL,
  `edit_code` mediumtext COLLATE utf8mb4_0900_bin,
  `share_link` varchar(255) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `permissions` varchar(50) COLLATE utf8mb4_0900_bin DEFAULT 'private',
  `create_time` timestamp NOT NULL,
  `save_time` timestamp NULL DEFAULT NULL,
  `last_execution` timestamp NULL DEFAULT NULL,
  `editor` varchar(50) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_item` (`service_item`),
  CONSTRAINT `prog_lang_services_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `prog_lang_services_ibfk_2` FOREIGN KEY (`service_item`) REFERENCES `service_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prog_lang_services`
--

LOCK TABLES `prog_lang_services` WRITE;
/*!40000 ALTER TABLE `prog_lang_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `prog_lang_services` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `service_items`
--

DROP TABLE IF EXISTS `service_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `service_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service_type` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL,
  `items` varchar(20) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `info` varchar(50) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `ver` varchar(50) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `service_items`
--

LOCK TABLES `service_items` WRITE;
/*!40000 ALTER TABLE `service_items` DISABLE KEYS */;
INSERT INTO `service_items` VALUES (1,'prog_lang','JavaScript','極致網頁體驗,JS無可替代','node:18'),(2,'prog_lang','Python','拯救你的生命,Python救急神器','3.11'),(3,'prog_lang','C++','沒有什麼C++解決不了的問題,除了你的時間','20'),(4,'prog_lang','Java','JAVA,開發無極限,記憶體例外','20'),(5,'web','Express','快速建立後端,Express路上一片風光','4.18');
/*!40000 ALTER TABLE `service_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL,
  `email` varchar(254) COLLATE utf8mb4_0900_bin NOT NULL,
  `password` varchar(100) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `create_time` timestamp NOT NULL,
  `use_teaching` int NOT NULL DEFAULT '0',
  `role` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL,
  `picture` varchar(255) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `provider` varchar(50) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `web_services`
--

DROP TABLE IF EXISTS `web_services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `web_services` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `project_name` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL,
  `service_item` int NOT NULL,
  `create_time` timestamp NOT NULL,
  `expired_time` timestamp NOT NULL,
  `server_port` int DEFAULT NULL,
  `server_link` varchar(255) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `state` varchar(50) COLLATE utf8mb4_0900_bin NOT NULL DEFAULT 'alive',
  `start_execution` timestamp NULL DEFAULT NULL,
  `expired_execution` timestamp NULL DEFAULT NULL,
  `storage_url` varchar(255) COLLATE utf8mb4_0900_bin DEFAULT NULL,
  `save_time` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `service_item` (`service_item`),
  CONSTRAINT `web_services_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `web_services_ibfk_2` FOREIGN KEY (`service_item`) REFERENCES `service_items` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `web_services`
--

LOCK TABLES `web_services` WRITE;
/*!40000 ALTER TABLE `web_services` DISABLE KEYS */;
/*!40000 ALTER TABLE `web_services` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-24  8:45:19
