-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: make_it_all
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `make_it_all`
--

/*!40000 DROP DATABASE IF EXISTS `make_it_all`*/;

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `make_it_all` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;

USE `make_it_all`;

--
-- Table structure for table `direct_message_attachments`
--

DROP TABLE IF EXISTS `direct_message_attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `direct_message_attachments` (
  `AttachmentID` int(11) NOT NULL AUTO_INCREMENT,
  `MessageID` int(11) NOT NULL,
  `Content` blob NOT NULL,
  PRIMARY KEY (`AttachmentID`),
  KEY `MessageID` (`MessageID`),
  CONSTRAINT `MessageID` FOREIGN KEY (`MessageID`) REFERENCES `direct_messages` (`MessageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direct_message_attachments`
--

LOCK TABLES `direct_message_attachments` WRITE;
/*!40000 ALTER TABLE `direct_message_attachments` DISABLE KEYS */;
/*!40000 ALTER TABLE `direct_message_attachments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `direct_messages`
--

DROP TABLE IF EXISTS `direct_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `direct_messages` (
  `MessageID` int(11) NOT NULL AUTO_INCREMENT,
  `Sender` int(11) NOT NULL,
  `Recipient` int(11) NOT NULL,
  `Content` varchar(1024) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`MessageID`),
  KEY `Sender` (`Sender`),
  KEY `Recipient` (`Recipient`),
  CONSTRAINT `Recipient` FOREIGN KEY (`Recipient`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Sender` FOREIGN KEY (`Sender`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direct_messages`
--

LOCK TABLES `direct_messages` WRITE;
/*!40000 ALTER TABLE `direct_messages` DISABLE KEYS */;
INSERT INTO `direct_messages` VALUES (1,2,1,'I have done my job','2025-03-16 19:41:24');
INSERT INTO `direct_messages` VALUES (2,1,2,'What is your job?','2025-03-16 20:02:27');
INSERT INTO `direct_messages` VALUES (3,2,1,'It\'s a tough one..','2025-03-16 20:02:58');
INSERT INTO `direct_messages` VALUES (4,2,1,'We do work','2025-03-16 20:08:16');
INSERT INTO `direct_messages` VALUES (5,1,2,'That\'s kinda lame','2025-03-16 20:31:14');
INSERT INTO `direct_messages` VALUES (6,1,2,'But it is what it is i guess...','2025-03-16 20:31:28');
INSERT INTO `direct_messages` VALUES (7,1,2,'Have you seen the news by the way?','2025-03-16 20:31:35');
INSERT INTO `direct_messages` VALUES (8,2,1,'No, i don\'t know how to read','2025-03-16 20:33:09');
INSERT INTO `direct_messages` VALUES (9,2,1,'Text to speech is really saving me right now.','2025-03-16 20:33:46');
INSERT INTO `direct_messages` VALUES (10,1,2,'???','2025-03-16 20:39:21');
INSERT INTO `direct_messages` VALUES (11,2,3,'I don\'t like the stock market','2025-03-16 20:42:42');
/*!40000 ALTER TABLE `direct_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `Forename` varchar(64) NOT NULL,
  `Surname` varchar(64) NOT NULL,
  `Role` enum('Manager','Staff') NOT NULL DEFAULT 'Staff',
  `Icon` blob NOT NULL DEFAULT '[default profile icon here]',
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr','Mime','Staff','[default profile icon here]');
INSERT INTO `users` VALUES (2,'John','Smith','Staff','[default profile icon here]');
INSERT INTO `users` VALUES (3,'Bill','Boomstick','Staff','[default profile icon here]');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-28  0:04:17
