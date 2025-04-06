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
-- Table structure for table `active_chats`
--

DROP TABLE IF EXISTS `active_chats`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `active_chats` (
  `UserID` int(11) NOT NULL,
  `Target` int(11) NOT NULL,
  `Type` enum('direct_messages','group_messages') NOT NULL,
  `LastUpdate` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`UserID`,`Target`,`Type`),
  CONSTRAINT `User is User` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_chats`
--

LOCK TABLES `active_chats` WRITE;
/*!40000 ALTER TABLE `active_chats` DISABLE KEYS */;
INSERT INTO `active_chats` VALUES (1,2,'direct_messages','2025-03-24 05:18:26');
INSERT INTO `active_chats` VALUES (1,3,'direct_messages','2025-03-24 06:58:29');
INSERT INTO `active_chats` VALUES (2,1,'direct_messages','2025-03-24 05:18:26');
INSERT INTO `active_chats` VALUES (2,1,'group_messages','2025-03-23 23:55:26');
INSERT INTO `active_chats` VALUES (3,1,'direct_messages','2025-03-24 06:58:29');
/*!40000 ALTER TABLE `active_chats` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direct_messages`
--

LOCK TABLES `direct_messages` WRITE;
/*!40000 ALTER TABLE `direct_messages` DISABLE KEYS */;
INSERT INTO `direct_messages` VALUES (1,2,1,'I have done my job','2025-03-16 19:41:24');
INSERT INTO `direct_messages` VALUES (2,1,2,'What is your job?','2025-03-16 20:02:27');
INSERT INTO `direct_messages` VALUES (3,2,1,'I do work','2025-03-17 02:02:58');
INSERT INTO `direct_messages` VALUES (4,1,2,'No you don\'t','2025-03-23 21:50:24');
INSERT INTO `direct_messages` VALUES (5,1,3,'I send you the message!','2025-03-23 23:26:33');
INSERT INTO `direct_messages` VALUES (6,1,3,'You get message?','2025-03-23 23:27:28');
INSERT INTO `direct_messages` VALUES (7,1,3,'I send you the message!','2025-03-23 23:37:05');
INSERT INTO `direct_messages` VALUES (8,1,3,'Why no refresh','2025-03-23 23:37:24');
INSERT INTO `direct_messages` VALUES (9,1,2,'Yo','2025-03-23 23:37:29');
INSERT INTO `direct_messages` VALUES (10,2,1,'Test','2025-03-24 00:22:17');
INSERT INTO `direct_messages` VALUES (11,2,1,'Hey don\'t you go hiding me','2025-03-24 05:13:42');
/*!40000 ALTER TABLE `direct_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_messages`
--

DROP TABLE IF EXISTS `group_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_messages` (
  `MessageID` int(11) NOT NULL AUTO_INCREMENT,
  `Sender` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL,
  `Content` varchar(1024) NOT NULL,
  `Timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`MessageID`),
  KEY `User is Sender` (`Sender`),
  KEY `Group is Group` (`GroupID`),
  CONSTRAINT `Group is Group` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User is Sender` FOREIGN KEY (`Sender`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_messages`
--

LOCK TABLES `group_messages` WRITE;
/*!40000 ALTER TABLE `group_messages` DISABLE KEYS */;
INSERT INTO `group_messages` VALUES (1,2,1,'Guys, It\'s official. I\'m a hater','2025-03-27 19:44:55');
/*!40000 ALTER TABLE `group_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `group_users`
--

DROP TABLE IF EXISTS `group_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `group_users` (
  `UserID` int(11) NOT NULL,
  `GroupID` int(11) NOT NULL,
  PRIMARY KEY (`UserID`,`GroupID`),
  KEY `Group is Group group_users` (`GroupID`),
  KEY `UserID` (`UserID`) USING BTREE,
  CONSTRAINT `Group is Group group_users` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User is User But Cool` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_users`
--

LOCK TABLES `group_users` WRITE;
/*!40000 ALTER TABLE `group_users` DISABLE KEYS */;
INSERT INTO `group_users` VALUES (1,1);
INSERT INTO `group_users` VALUES (2,1);
/*!40000 ALTER TABLE `group_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `GroupID` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(64) NOT NULL,
  `Owner` int(11) NOT NULL,
  PRIMARY KEY (`GroupID`),
  KEY `Group Owner` (`Owner`),
  CONSTRAINT `Group Owner` FOREIGN KEY (`Owner`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'The Haters',2);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
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
  `PasswordHash` varchar(60) NOT NULL,
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr','Mime','Staff','[default profile icon here]','ABC123BCA!!!');
INSERT INTO `users` VALUES (2,'John','Smith','Staff','[default profile icon here]','ABC123BCA!!!');
INSERT INTO `users` VALUES (3,'Bill','Boomstick','Staff','[default profile icon here]','ABC123BCA!!!');
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

-- Dump completed on 2025-04-06 18:05:03
