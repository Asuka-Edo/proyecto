-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: gimnasio_bd2_redis
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `administrador`
--

DROP TABLE IF EXISTS `administrador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `administrador` (
  `id_administrador` int NOT NULL AUTO_INCREMENT,
  `fk_nivel_acceso` int NOT NULL,
  `departamento` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_usuario` int NOT NULL,
  PRIMARY KEY (`id_administrador`),
  UNIQUE KEY `fk_usuario` (`fk_usuario`),
  KEY `fk_administrador_nivel_acceso` (`fk_nivel_acceso`),
  CONSTRAINT `administrador_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_administrador_nivel_acceso` FOREIGN KEY (`fk_nivel_acceso`) REFERENCES `nivel_acceso` (`id_nivel_acceso`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `administrador`
--

LOCK TABLES `administrador` WRITE;
/*!40000 ALTER TABLE `administrador` DISABLE KEYS */;
INSERT INTO `administrador` VALUES (2,1,NULL,9),(3,1,NULL,10);
/*!40000 ALTER TABLE `administrador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `asistencia`
--

DROP TABLE IF EXISTS `asistencia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asistencia` (
  `id_asistencia` int NOT NULL AUTO_INCREMENT,
  `fk_membresia` int NOT NULL,
  `fecha` date NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_usuario_registro` int NOT NULL,
  PRIMARY KEY (`id_asistencia`),
  UNIQUE KEY `uq_asistencia_membresia_fecha` (`fk_membresia`,`fecha`),
  KEY `fk_asistencia_usuario_registro` (`fk_usuario_registro`),
  KEY `idx_asistencia_fk_membresia` (`fk_membresia`),
  KEY `idx_asistencia_fecha` (`fecha`),
  CONSTRAINT `fk_asistencia_membresia` FOREIGN KEY (`fk_membresia`) REFERENCES `membresia` (`id_membresia`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_asistencia_usuario_registro` FOREIGN KEY (`fk_usuario_registro`) REFERENCES `usuario` (`id_usuario`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asistencia`
--

LOCK TABLES `asistencia` WRITE;
/*!40000 ALTER TABLE `asistencia` DISABLE KEYS */;
INSERT INTO `asistencia` VALUES (1,1,'2026-11-09','2026-11-09 11:33:07',10),(2,1,'2026-11-10','2026-11-10 10:00:09',10);
/*!40000 ALTER TABLE `asistencia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clase`
--

DROP TABLE IF EXISTS `clase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clase` (
  `id_clase` int NOT NULL AUTO_INCREMENT,
  `nombre_clase` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `capacidad_maxima` int NOT NULL,
  PRIMARY KEY (`id_clase`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clase`
--

LOCK TABLES `clase` WRITE;
/*!40000 ALTER TABLE `clase` DISABLE KEYS */;
INSERT INTO `clase` VALUES (1,'Yoga','dfghjklñ',20);
/*!40000 ALTER TABLE `clase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cliente`
--

DROP TABLE IF EXISTS `cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cliente` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `codigo_miembro` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `contacto_emergencia` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_usuario` int NOT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `fk_usuario` (`fk_usuario`),
  UNIQUE KEY `codigo_miembro` (`codigo_miembro`),
  CONSTRAINT `cliente_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cliente`
--

LOCK TABLES `cliente` WRITE;
/*!40000 ALTER TABLE `cliente` DISABLE KEYS */;
INSERT INTO `cliente` VALUES (1,'MIEM-DEMO-001','1995-06-15','Mario Gutiérrez - 3009998877',3);
/*!40000 ALTER TABLE `cliente` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_rutina`
--

DROP TABLE IF EXISTS `detalle_rutina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_rutina` (
  `id_detalle` int NOT NULL AUTO_INCREMENT,
  `dia_semana` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `series` int NOT NULL,
  `repeticiones` int NOT NULL,
  `descanso_segundos` int DEFAULT NULL,
  `fk_rutina` int NOT NULL,
  `fk_ejercicio` int NOT NULL,
  PRIMARY KEY (`id_detalle`),
  KEY `fk_rutina` (`fk_rutina`),
  KEY `fk_ejercicio` (`fk_ejercicio`),
  CONSTRAINT `detalle_rutina_ibfk_1` FOREIGN KEY (`fk_rutina`) REFERENCES `rutina` (`id_rutina`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `detalle_rutina_ibfk_2` FOREIGN KEY (`fk_ejercicio`) REFERENCES `ejercicio` (`id_ejercicio`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_rutina`
--

LOCK TABLES `detalle_rutina` WRITE;
/*!40000 ALTER TABLE `detalle_rutina` DISABLE KEYS */;
INSERT INTO `detalle_rutina` VALUES (1,'Lunes',4,12,60,1,1);
/*!40000 ALTER TABLE `detalle_rutina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ejercicio`
--

DROP TABLE IF EXISTS `ejercicio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ejercicio` (
  `id_ejercicio` int NOT NULL AUTO_INCREMENT,
  `nombre_ejercicio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_ejercicio`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ejercicio`
--

LOCK TABLES `ejercicio` WRITE;
/*!40000 ALTER TABLE `ejercicio` DISABLE KEYS */;
INSERT INTO `ejercicio` VALUES (1,'Press banca','Pecho','Instruccion'),(2,'pres inclinado','Pecho','press');
/*!40000 ALTER TABLE `ejercicio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `entrenador`
--

DROP TABLE IF EXISTS `entrenador`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `entrenador` (
  `id_entrenador` int NOT NULL AUTO_INCREMENT,
  `especialidad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `licencia_certificacion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `turno_trabajo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_usuario` int NOT NULL,
  PRIMARY KEY (`id_entrenador`),
  UNIQUE KEY `fk_usuario` (`fk_usuario`),
  CONSTRAINT `entrenador_ibfk_1` FOREIGN KEY (`fk_usuario`) REFERENCES `usuario` (`id_usuario`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `entrenador`
--

LOCK TABLES `entrenador` WRITE;
/*!40000 ALTER TABLE `entrenador` DISABLE KEYS */;
INSERT INTO `entrenador` VALUES (1,'Musculación','LIC-DEMO-001','Mañana',2),(2,NULL,NULL,NULL,4),(3,NULL,NULL,NULL,5),(4,NULL,NULL,NULL,6);
/*!40000 ALTER TABLE `entrenador` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `estado`
--

DROP TABLE IF EXISTS `estado`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `estado` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `uq_estado_nombre` (`nombre_estado`),
  CONSTRAINT `chk_estado_nombre` CHECK ((`nombre_estado` in (_utf8mb4'Activo',_utf8mb4'Inactivo')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `estado`
--

LOCK TABLES `estado` WRITE;
/*!40000 ALTER TABLE `estado` DISABLE KEYS */;
INSERT INTO `estado` VALUES (1,'Activo'),(2,'Inactivo');
/*!40000 ALTER TABLE `estado` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ficha_tecnica`
--

DROP TABLE IF EXISTS `ficha_tecnica`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ficha_tecnica` (
  `id_ficha` int NOT NULL AUTO_INCREMENT,
  `peso_kg` decimal(5,2) DEFAULT NULL,
  `estatura` decimal(5,2) DEFAULT NULL,
  `porcentaje_grasa` decimal(4,2) DEFAULT NULL,
  `observaciones_medicas` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `objetivos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_actualizacion` datetime DEFAULT NULL,
  `fk_cliente` int NOT NULL,
  PRIMARY KEY (`id_ficha`),
  UNIQUE KEY `fk_cliente` (`fk_cliente`),
  CONSTRAINT `ficha_tecnica_ibfk_1` FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ficha_tecnica`
--

LOCK TABLES `ficha_tecnica` WRITE;
/*!40000 ALTER TABLE `ficha_tecnica` DISABLE KEYS */;
/*!40000 ALTER TABLE `ficha_tecnica` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `membresia`
--

DROP TABLE IF EXISTS `membresia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `membresia` (
  `id_membresia` int NOT NULL AUTO_INCREMENT,
  `fk_cliente` int NOT NULL,
  `fk_plan` int NOT NULL,
  `fecha_inicio` date NOT NULL,
  `fecha_vencimiento` date NOT NULL,
  `precio_pagado` decimal(10,2) NOT NULL COMMENT 'Precio congelado al momento de la asignación',
  `ingresos_incluidos` int DEFAULT NULL COMMENT 'Copia congelada de plan.ingresos_incluidos al asignar/editar; NULL = ilimitado',
  `estado_membresia` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'Activa',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_membresia`),
  KEY `idx_membresia_fk_plan` (`fk_plan`),
  KEY `idx_membresia_vigencia` (`estado_membresia`,`fecha_inicio`,`fecha_vencimiento`),
  KEY `idx_membresia_fk_cliente` (`fk_cliente`),
  CONSTRAINT `fk_membresia_cliente` FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_membresia_plan` FOREIGN KEY (`fk_plan`) REFERENCES `plan` (`id_plan`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `chk_membresia_estado` CHECK ((`estado_membresia` in (_utf8mb4'Activa',_utf8mb4'Vencida',_utf8mb4'Cancelada'))),
  CONSTRAINT `chk_membresia_fechas` CHECK ((`fecha_vencimiento` >= `fecha_inicio`)),
  CONSTRAINT `chk_membresia_precio` CHECK ((`precio_pagado` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membresia`
--

LOCK TABLES `membresia` WRITE;
/*!40000 ALTER TABLE `membresia` DISABLE KEYS */;
INSERT INTO `membresia` VALUES (1,1,1,'2026-11-09','2026-12-09',80000.00,NULL,'Activa','2026-11-09 16:31:52','2026-11-09 16:31:52'),(2,1,4,'2026-11-09','2027-02-07',80000.00,1,'Activa','2026-11-09 16:57:53','2026-11-09 16:57:53'),(3,1,1,'2026-11-11','2026-12-11',100000.00,NULL,'Activa','2026-11-11 14:52:13','2026-11-11 14:52:13');
/*!40000 ALTER TABLE `membresia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `modulo`
--

DROP TABLE IF EXISTS `modulo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `modulo` (
  `id_modulo` int NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(60) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_modulo`),
  UNIQUE KEY `uq_modulo_nombre` (`nombre_modulo`),
  UNIQUE KEY `uq_modulo_ruta` (`ruta`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `modulo`
--

LOCK TABLES `modulo` WRITE;
/*!40000 ALTER TABLE `modulo` DISABLE KEYS */;
INSERT INTO `modulo` VALUES (1,'Dashboard','/dashboard'),(2,'Usuarios','/usuarios'),(3,'Planes','/admin/planes'),(4,'Membresías','/admin/membresias'),(5,'Asistencias','/admin/asistencias'),(6,'Ejercicios','/admin/ejercicios'),(7,'Rutinas','/admin/rutinas'),(8,'Clases','/admin/clases'),(9,'Reportes','/admin/reportes'),(10,'Mi Membresía','/mi-membresia'),(11,'Mi Rutina','/mi-rutina'),(12,'Mi Ficha Técnica','/mi-ficha-tecnica'),(13,'Reservar Clase','/reservar-clase'),(14,'Mis Reservas','/mis-reservas');
/*!40000 ALTER TABLE `modulo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nivel_acceso`
--

DROP TABLE IF EXISTS `nivel_acceso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nivel_acceso` (
  `id_nivel_acceso` int NOT NULL AUTO_INCREMENT,
  `nombre_nivel_acceso` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_nivel_acceso`),
  UNIQUE KEY `uq_nivel_acceso_nombre` (`nombre_nivel_acceso`),
  CONSTRAINT `chk_nivel_acceso_nombre` CHECK ((`nombre_nivel_acceso` in (_utf8mb4'Total',_utf8mb4'Limitado')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nivel_acceso`
--

LOCK TABLES `nivel_acceso` WRITE;
/*!40000 ALTER TABLE `nivel_acceso` DISABLE KEYS */;
INSERT INTO `nivel_acceso` VALUES (2,'Limitado'),(1,'Total');
/*!40000 ALTER TABLE `nivel_acceso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pago`
--

DROP TABLE IF EXISTS `pago`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pago` (
  `id_pago` int NOT NULL AUTO_INCREMENT,
  `monto` decimal(10,2) NOT NULL,
  `fecha_pago` datetime DEFAULT NULL,
  `metodo_pago` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado_pago` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_membresia` int NOT NULL,
  PRIMARY KEY (`id_pago`),
  KEY `idx_pago_fecha_pago` (`fecha_pago`),
  KEY `idx_pago_fk_membresia` (`fk_membresia`),
  CONSTRAINT `fk_pago_membresia` FOREIGN KEY (`fk_membresia`) REFERENCES `membresia` (`id_membresia`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pago`
--

LOCK TABLES `pago` WRITE;
/*!40000 ALTER TABLE `pago` DISABLE KEYS */;
INSERT INTO `pago` VALUES (1,80000.00,'2026-11-09 11:31:52','Efectivo','Pagado',1),(2,80000.00,'2026-11-09 11:57:53','Efectivo','Pagado',2);
/*!40000 ALTER TABLE `pago` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `nombre_perfil` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_perfil`),
  UNIQUE KEY `uq_perfil_nombre` (`nombre_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
INSERT INTO `perfil` VALUES (1,'Administrador'),(3,'Cliente'),(2,'Entrenador');
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil_modulo_permiso`
--

DROP TABLE IF EXISTS `perfil_modulo_permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil_modulo_permiso` (
  `id_perfil_modulo_permiso` int NOT NULL AUTO_INCREMENT,
  `fk_perfil` int NOT NULL,
  `fk_modulo` int NOT NULL,
  `fk_permiso` int NOT NULL,
  PRIMARY KEY (`id_perfil_modulo_permiso`),
  UNIQUE KEY `uq_perfil_modulo_permiso` (`fk_perfil`,`fk_modulo`,`fk_permiso`),
  KEY `fk_pmp_modulo` (`fk_modulo`),
  KEY `fk_pmp_permiso` (`fk_permiso`),
  CONSTRAINT `fk_pmp_modulo` FOREIGN KEY (`fk_modulo`) REFERENCES `modulo` (`id_modulo`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pmp_perfil` FOREIGN KEY (`fk_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pmp_permiso` FOREIGN KEY (`fk_permiso`) REFERENCES `permiso` (`id_permiso`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil_modulo_permiso`
--

LOCK TABLES `perfil_modulo_permiso` WRITE;
/*!40000 ALTER TABLE `perfil_modulo_permiso` DISABLE KEYS */;
INSERT INTO `perfil_modulo_permiso` VALUES (8,1,1,1),(9,1,2,1),(5,1,3,1),(4,1,4,1),(1,1,5,1),(3,1,6,1),(7,1,7,1),(2,1,8,1),(6,1,9,1),(20,2,1,1),(17,2,6,1),(19,2,7,1),(16,2,8,1),(18,2,9,1),(23,3,1,1),(25,3,10,1),(26,3,11,1),(24,3,12,1),(28,3,13,1),(27,3,14,1);
/*!40000 ALTER TABLE `perfil_modulo_permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permiso`
--

DROP TABLE IF EXISTS `permiso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permiso` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `uq_permiso_nombre` (`nombre_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permiso`
--

LOCK TABLES `permiso` WRITE;
/*!40000 ALTER TABLE `permiso` DISABLE KEYS */;
INSERT INTO `permiso` VALUES (1,'Ver');
/*!40000 ALTER TABLE `permiso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plan`
--

DROP TABLE IF EXISTS `plan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plan` (
  `id_plan` int NOT NULL AUTO_INCREMENT,
  `nombre_plan` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `duracion_dias` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `ingresos_incluidos` int DEFAULT NULL COMMENT 'Número de ingresos incluidos; NULL = ilimitado',
  `activo` tinyint(1) NOT NULL DEFAULT '1' COMMENT '1 = Activo/Disponible, 0 = Desactivado',
  `creado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `actualizado_en` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_plan`),
  UNIQUE KEY `uq_plan_nombre` (`nombre_plan`),
  CONSTRAINT `chk_plan_duracion` CHECK ((`duracion_dias` > 0)),
  CONSTRAINT `chk_plan_precio` CHECK ((`precio` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plan`
--

LOCK TABLES `plan` WRITE;
/*!40000 ALTER TABLE `plan` DISABLE KEYS */;
INSERT INTO `plan` VALUES (1,'Plan Mensual Demo','Acceso ilimitado al gimnasio durante 30 días',30,80000.00,NULL,1,'2026-10-06 06:46:08','2026-11-10 14:59:25'),(2,'Anual','Acceso ilimitado un año',360,200000.00,1,1,'2026-11-09 16:54:15','2026-11-09 16:55:24'),(3,'mensual','jjk',30,1000000.00,1,1,'2026-11-09 16:54:30','2026-11-09 16:55:47'),(4,'trimestral','gfd',90,80000.00,1,1,'2026-11-09 16:55:05','2026-11-09 16:55:33');
/*!40000 ALTER TABLE `plan` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programacion_clase`
--

DROP TABLE IF EXISTS `programacion_clase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programacion_clase` (
  `id_programacion` int NOT NULL AUTO_INCREMENT,
  `fecha` date NOT NULL,
  `hora_inicio` time NOT NULL,
  `hora_fin` time NOT NULL,
  `cupos_disponibles` int NOT NULL,
  `fk_clase` int NOT NULL,
  `fk_entrenador` int NOT NULL,
  PRIMARY KEY (`id_programacion`),
  KEY `fk_clase` (`fk_clase`),
  KEY `fk_entrenador` (`fk_entrenador`),
  KEY `idx_programacion_fecha` (`fecha`),
  CONSTRAINT `programacion_clase_ibfk_1` FOREIGN KEY (`fk_clase`) REFERENCES `clase` (`id_clase`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `programacion_clase_ibfk_2` FOREIGN KEY (`fk_entrenador`) REFERENCES `entrenador` (`id_entrenador`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programacion_clase`
--

LOCK TABLES `programacion_clase` WRITE;
/*!40000 ALTER TABLE `programacion_clase` DISABLE KEYS */;
/*!40000 ALTER TABLE `programacion_clase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reserva_clase`
--

DROP TABLE IF EXISTS `reserva_clase`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reserva_clase` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `fecha_reserva` datetime DEFAULT NULL,
  `estado_reserva` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_programacion` int NOT NULL,
  `fk_cliente` int NOT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `fk_programacion` (`fk_programacion`),
  KEY `fk_cliente` (`fk_cliente`),
  CONSTRAINT `reserva_clase_ibfk_1` FOREIGN KEY (`fk_programacion`) REFERENCES `programacion_clase` (`id_programacion`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `reserva_clase_ibfk_2` FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reserva_clase`
--

LOCK TABLES `reserva_clase` WRITE;
/*!40000 ALTER TABLE `reserva_clase` DISABLE KEYS */;
/*!40000 ALTER TABLE `reserva_clase` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rol`
--

DROP TABLE IF EXISTS `rol`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` enum('Administrador','Entrenador','Cliente') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rol`
--

LOCK TABLES `rol` WRITE;
/*!40000 ALTER TABLE `rol` DISABLE KEYS */;
INSERT INTO `rol` VALUES (1,'Cliente','Usuario cliente del gimnasio'),(2,'Administrador','Acceso completo al sistema'),(3,'Entrenador','Gestion de rutinas y clases');
/*!40000 ALTER TABLE `rol` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rutina`
--

DROP TABLE IF EXISTS `rutina`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rutina` (
  `id_rutina` int NOT NULL AUTO_INCREMENT,
  `nombre_rutina` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `objetivo` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `estado` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_cliente` int NOT NULL,
  `fk_entrenador` int NOT NULL,
  PRIMARY KEY (`id_rutina`),
  KEY `fk_cliente` (`fk_cliente`),
  KEY `fk_entrenador` (`fk_entrenador`),
  KEY `idx_rutina_fechas` (`fecha_inicio`,`fecha_fin`),
  CONSTRAINT `rutina_ibfk_1` FOREIGN KEY (`fk_cliente`) REFERENCES `cliente` (`id_cliente`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `rutina_ibfk_2` FOREIGN KEY (`fk_entrenador`) REFERENCES `entrenador` (`id_entrenador`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rutina`
--

LOCK TABLES `rutina` WRITE;
/*!40000 ALTER TABLE `rutina` DISABLE KEYS */;
INSERT INTO `rutina` VALUES (1,'Fuerza','Acondicionamiento','2026-11-09','2026-11-11','Activa',1,3);
/*!40000 ALTER TABLE `rutina` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `apellido` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `documento_identidad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `correo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `contrasena` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `intentos_fallidos` int NOT NULL DEFAULT '0',
  `bloqueado_hasta` datetime DEFAULT NULL,
  `telefono` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fk_estado` int NOT NULL,
  `fecha_registro` datetime DEFAULT NULL,
  `fk_rol` int NOT NULL,
  `fk_perfil` int NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE KEY `documento_identidad` (`documento_identidad`),
  UNIQUE KEY `correo` (`correo`),
  KEY `fk_rol` (`fk_rol`),
  KEY `fk_usuario_estado` (`fk_estado`),
  KEY `fk_usuario_perfil` (`fk_perfil`),
  CONSTRAINT `fk_usuario_estado` FOREIGN KEY (`fk_estado`) REFERENCES `estado` (`id_estado`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_perfil` FOREIGN KEY (`fk_perfil`) REFERENCES `perfil` (`id_perfil`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `usuario_ibfk_1` FOREIGN KEY (`fk_rol`) REFERENCES `rol` (`id_rol`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (2,'Andrés','Mendoza','80456123','entrenador@gimnasio.com','$2b$12$gkYhRH0Zp5TOlxfciUIDguttQzetHRzYP9DGrVkttpFpnGBUmc412',0,NULL,'3204445566',1,'2026-10-06 01:46:08',3,2),(3,'Sofía','Gutiérrez','1020304050','cliente@gimnasio.com','$2b$12$gkYhRH0Zp5TOlxfciUIDguttQzetHRzYP9DGrVkttpFpnGBUmc412',0,NULL,'3157778899',1,'2026-10-06 01:46:08',1,3),(4,'Cristina','restrepo','1040357219','kristinadepor@gmail.com','$2b$12$o63xkRlOdTJLVOIIOHCas.h6mP9ryJi4Bmx4AKqf7ziy3Tl9n3R8K',0,NULL,'3202295752',1,'2026-10-06 09:52:53',3,2),(5,'michael','polo','1040357218','polo@gmail.com','$2b$12$Tg8EbchUoY7rWy6xMxI6KOf.UkfKrPqi7TO86kb5dS7SOPChlUJEK',0,NULL,'3202295755',1,'2026-10-06 09:54:57',3,2),(6,'jemilson','solano','1040357222','sol@gmail.com','$2b$12$3wAwVSeFByfQPbl2.N/XIeugNnB1dQuvXZGwSNi/nucYAWSCsx/Qe',0,NULL,'3202295720',1,'2026-10-06 09:58:04',3,2),(7,'A','B','123','a@a.net','12345678',2,NULL,'321456978',1,'2026-11-09 10:30:19',2,1),(9,'Admin','Gimnasio','1234567890','admin@gimnasio.com','$2b$12$9C0aWyZkISpVAW2KkE3da.Fy9iHwrMp59RBgm.Ag7mCQLJWPFdXRq',0,NULL,'3001234567',1,'2026-11-09 10:44:52',2,1),(10,'Admin2','Gimnasio','0987654321','admin2@gimnasio.com','$2b$12$LKz2XxSopCj5Ns/74z01LeBxpHBnGOTzK0NOuDji/pyaRmgT3FMfm',0,NULL,'3109876543',1,'2026-11-09 11:26:03',2,1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'gimnasio_bd2_redis'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-11-11  9:56:07
