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
  `LastUpdate` timestamp NOT NULL DEFAULT current_timestamp(),
  `LastRead` timestamp NULL DEFAULT NULL,
  UNIQUE KEY `UserID` (`UserID`,`Target`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_chats`
--

LOCK TABLES `active_chats` WRITE;
/*!40000 ALTER TABLE `active_chats` DISABLE KEYS */;
INSERT INTO `active_chats` VALUES (1,2,'2025-05-03 14:38:48','2025-05-01 07:51:20');
INSERT INTO `active_chats` VALUES (1,3,'2025-04-20 00:02:28','2025-04-21 17:32:07');
INSERT INTO `active_chats` VALUES (2,1,'2025-05-03 14:38:48','2025-04-21 17:55:07');
INSERT INTO `active_chats` VALUES (2,3,'2025-04-20 07:07:03','2025-04-21 17:55:08');
INSERT INTO `active_chats` VALUES (3,1,'2025-04-20 00:02:28','2025-04-20 07:27:10');
INSERT INTO `active_chats` VALUES (3,2,'2025-04-20 07:07:03','2025-04-20 07:27:08');
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
  `isEdited` tinyint(1) NOT NULL DEFAULT 0,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`MessageID`),
  KEY `Sender` (`Sender`),
  KEY `Recipient` (`Recipient`),
  CONSTRAINT `Recipient` FOREIGN KEY (`Recipient`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `Sender` FOREIGN KEY (`Sender`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `direct_messages`
--

LOCK TABLES `direct_messages` WRITE;
/*!40000 ALTER TABLE `direct_messages` DISABLE KEYS */;
INSERT INTO `direct_messages` VALUES (1,2,1,'I have done my job','2025-03-16 19:41:24',0,0);
INSERT INTO `direct_messages` VALUES (2,1,2,'What is your job?','2025-03-16 20:02:27',0,0);
INSERT INTO `direct_messages` VALUES (3,2,1,'I do work','2025-03-17 02:02:58',0,0);
INSERT INTO `direct_messages` VALUES (4,1,2,'No you don\'t!','2025-03-23 21:50:24',0,0);
INSERT INTO `direct_messages` VALUES (5,1,3,'I send you the message!','2025-03-23 23:26:33',0,0);
INSERT INTO `direct_messages` VALUES (6,1,3,'You get message?','2025-03-23 23:27:28',0,0);
INSERT INTO `direct_messages` VALUES (7,1,3,'I send you the message!','2025-03-23 23:37:05',0,0);
INSERT INTO `direct_messages` VALUES (8,1,3,'Why no refresh?','2025-03-23 23:37:24',0,0);
INSERT INTO `direct_messages` VALUES (9,1,2,'You\'re faking it...','2025-03-23 23:37:29',0,0);
INSERT INTO `direct_messages` VALUES (10,2,1,'Test','2025-03-24 00:22:17',0,0);
INSERT INTO `direct_messages` VALUES (11,2,1,'Hey don\'t you go hiding me','2025-03-24 05:13:42',0,0);
INSERT INTO `direct_messages` VALUES (14,1,2,'What are you even testing?','2025-04-11 12:42:20',0,0);
INSERT INTO `direct_messages` VALUES (15,1,2,'I\'m going to Asda by the way','2025-04-11 12:51:20',0,0);
INSERT INTO `direct_messages` VALUES (16,1,2,'Sorry, i meant Lidl, i don\'t like Asda','2025-04-11 21:27:44',0,0);
INSERT INTO `direct_messages` VALUES (17,2,1,'Hi just updating you on everything','2025-04-11 21:32:50',0,0);
INSERT INTO `direct_messages` VALUES (18,2,1,'test','2025-04-12 14:57:06',0,0);
INSERT INTO `direct_messages` VALUES (19,1,2,'test','2025-04-12 15:04:29',0,0);
INSERT INTO `direct_messages` VALUES (20,1,2,'What are we testing again','2025-04-12 18:18:58',0,0);
INSERT INTO `direct_messages` VALUES (21,1,2,'I\'ve reported you for fraud btw.','2025-04-12 18:54:01',0,0);
INSERT INTO `direct_messages` VALUES (22,2,1,'oh okay nvm ;-;','2025-04-12 18:54:58',0,0);
INSERT INTO `direct_messages` VALUES (23,2,1,'hi','2025-04-20 06:06:24',0,0);
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
  `isEdited` tinyint(1) NOT NULL DEFAULT 0,
  `isDeleted` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`MessageID`),
  KEY `User is Sender` (`Sender`),
  KEY `Group is Group` (`GroupID`),
  CONSTRAINT `Group is Group` FOREIGN KEY (`GroupID`) REFERENCES `groups` (`GroupID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `User is Sender` FOREIGN KEY (`Sender`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `group_messages`
--

LOCK TABLES `group_messages` WRITE;
/*!40000 ALTER TABLE `group_messages` DISABLE KEYS */;
INSERT INTO `group_messages` VALUES (1,2,1,'Guys, It\'s official. I\'m a hater','2025-03-27 19:44:55',0,0);
INSERT INTO `group_messages` VALUES (2,2,1,'Welcome back guys','2025-04-11 21:33:11',0,0);
INSERT INTO `group_messages` VALUES (3,1,1,'huh','2025-04-12 12:03:10',0,0);
INSERT INTO `group_messages` VALUES (4,2,1,'refresh','2025-04-12 14:56:46',0,0);
INSERT INTO `group_messages` VALUES (5,2,1,'test','2025-04-12 14:56:53',0,0);
INSERT INTO `group_messages` VALUES (6,1,1,'bug','2025-04-12 15:00:19',0,0);
INSERT INTO `group_messages` VALUES (7,1,1,'test','2025-04-12 15:01:30',0,0);
INSERT INTO `group_messages` VALUES (8,1,1,'fixed?','2025-04-12 15:04:57',0,0);
INSERT INTO `group_messages` VALUES (9,1,1,'fixed','2025-04-12 15:05:07',0,0);
INSERT INTO `group_messages` VALUES (10,1,1,'okay it\'s fixed now','2025-04-12 15:05:10',0,0);
INSERT INTO `group_messages` VALUES (11,1,1,'test','2025-04-12 16:34:56',0,0);
INSERT INTO `group_messages` VALUES (12,1,1,'testerrr','2025-04-12 18:12:36',0,0);
INSERT INTO `group_messages` VALUES (13,2,1,'fixed huh?','2025-04-12 18:53:22',0,0);
INSERT INTO `group_messages` VALUES (14,1,1,'Hate it here','2025-04-13 09:40:43',0,0);
INSERT INTO `group_messages` VALUES (15,1,2,'Love it here','2025-04-20 00:01:36',0,0);
INSERT INTO `group_messages` VALUES (16,1,2,'It\'s just so','2025-04-20 00:02:16',0,0);
INSERT INTO `group_messages` VALUES (17,1,2,'Like cool','2025-04-20 00:02:24',0,0);
INSERT INTO `group_messages` VALUES (18,1,2,'Sorry for spam','2025-04-20 00:28:48',0,0);
INSERT INTO `group_messages` VALUES (19,1,3,'Does this work lol','2025-04-20 01:17:21',0,0);
INSERT INTO `group_messages` VALUES (20,1,1,'Changed my mind about here','2025-04-20 01:52:59',1,0);
INSERT INTO `group_messages` VALUES (21,4,2,'I don\'t even know who i am','2025-04-20 04:55:21',0,0);
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
  `LastRead` timestamp NULL DEFAULT NULL,
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
INSERT INTO `group_users` VALUES (1,1,'2025-05-01 07:51:23');
INSERT INTO `group_users` VALUES (1,2,'2025-05-01 07:31:47');
INSERT INTO `group_users` VALUES (1,3,'2025-05-01 07:51:19');
INSERT INTO `group_users` VALUES (2,1,'2025-04-21 17:55:06');
INSERT INTO `group_users` VALUES (2,2,'2025-04-21 17:55:04');
INSERT INTO `group_users` VALUES (2,3,'2025-04-21 17:55:05');
INSERT INTO `group_users` VALUES (3,1,'2025-04-20 07:27:11');
INSERT INTO `group_users` VALUES (4,2,NULL);
INSERT INTO `group_users` VALUES (4,3,NULL);
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
  `LastUpdate` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`GroupID`),
  KEY `Group Owner` (`Owner`),
  CONSTRAINT `Group Owner` FOREIGN KEY (`Owner`) REFERENCES `users` (`UserID`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'The Haters',2,'2025-05-03 15:01:06');
INSERT INTO `groups` VALUES (2,'The Lovers',3,'2025-04-20 04:55:21');
INSERT INTO `groups` VALUES (3,'New Group!',1,'2025-04-20 06:44:03');
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `project_users`
--

DROP TABLE IF EXISTS `project_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `project_users` (
  `ProjectID` int(11) NOT NULL,
  `AssigneeID` int(11) NOT NULL,
  PRIMARY KEY (`ProjectID`,`AssigneeID`),
  KEY `AssigneeUserID` (`AssigneeID`),
  CONSTRAINT `AssigneeUserID` FOREIGN KEY (`AssigneeID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `UserProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ProjectID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `project_users`
--

LOCK TABLES `project_users` WRITE;
/*!40000 ALTER TABLE `project_users` DISABLE KEYS */;
INSERT INTO `project_users` VALUES (1,1);
INSERT INTO `project_users` VALUES (1,3);
/*!40000 ALTER TABLE `project_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `projects` (
  `ProjectID` int(11) NOT NULL AUTO_INCREMENT,
  `LeaderID` int(11) NOT NULL,
  `Title` varchar(64) NOT NULL,
  `Priority` enum('Low','Medium','High') DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  PRIMARY KEY (`ProjectID`),
  KEY `LeaderID` (`LeaderID`),
  CONSTRAINT `LeaderID` FOREIGN KEY (`LeaderID`) REFERENCES `users` (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES (1,3,'Make More Boomsticks','High','2025-04-12','2025-08-18');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tasks`
--

DROP TABLE IF EXISTS `tasks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tasks` (
  `TaskID` int(11) NOT NULL AUTO_INCREMENT,
  `ProjectID` int(11) NOT NULL,
  `AssigneeID` int(11) NOT NULL,
  `Title` varchar(64) NOT NULL,
  `Priority` enum('Low','Medium','High') NOT NULL,
  `HoursRequired` int(11) DEFAULT NULL,
  `StartDate` date DEFAULT NULL,
  `Deadline` date DEFAULT NULL,
  PRIMARY KEY (`TaskID`),
  KEY `AssigneeID` (`AssigneeID`),
  KEY `ProjectID` (`ProjectID`),
  CONSTRAINT `AssigneeID` FOREIGN KEY (`AssigneeID`) REFERENCES `users` (`UserID`),
  CONSTRAINT `ProjectID` FOREIGN KEY (`ProjectID`) REFERENCES `projects` (`ProjectID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tasks`
--

LOCK TABLES `tasks` WRITE;
/*!40000 ALTER TABLE `tasks` DISABLE KEYS */;
INSERT INTO `tasks` VALUES (1,1,3,'Boomstick Procurement','High',20,'2025-04-12','2025-04-19');
INSERT INTO `tasks` VALUES (2,1,1,'Polish Boomsticks','Medium',10,'2025-04-17','2025-04-22');
/*!40000 ALTER TABLE `tasks` ENABLE KEYS */;
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
  `Role` enum('Manager','Employee') NOT NULL DEFAULT 'Employee',
  `Icon` blob DEFAULT NULL,
  `PasswordHash` varchar(60) NOT NULL,
  `Status` enum('Online','Offline','Invisible','DND','Away') NOT NULL DEFAULT 'Offline',
  `SavedStatus` enum('Online','DND','Away') NOT NULL DEFAULT 'Online',
  PRIMARY KEY (`UserID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Mr','Mime','Employee','[default profile icon here]','ABC123BCA!!!','DND','DND');
INSERT INTO `users` VALUES (2,'John','Smith','Manager','[default profile icon here]','ABC123BCA!!!','Offline','DND');
INSERT INTO `users` VALUES (3,'Bill','Boomstick','Employee','[default profile icon here]','ABC123BCA!!!','Offline','Online');
INSERT INTO `users` VALUES (4,'Faker','Realman','Employee','[default profile icon here]','12A','Offline','Online');
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

-- Dump completed on 2025-05-04 13:12:33
