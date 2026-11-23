-- Backup Completo Gimnasio MySQL para Despliegue en la Nube
SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS `administrador`;
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

INSERT INTO `administrador` (`id_administrador`, `fk_nivel_acceso`, `departamento`, `fk_usuario`) VALUES
(2, 1, NULL, 9),
(3, 1, NULL, 10);

DROP TABLE IF EXISTS `asistencia`;
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `asistencia` (`id_asistencia`, `fk_membresia`, `fecha`, `fecha_hora`, `fk_usuario_registro`) VALUES
(1, 1, '2026-11-09', '2026-11-09 11:33:07', 10),
(2, 1, '2026-11-10', '2026-11-10 10:00:09', 10),
(3, 5, '2026-11-11', '2026-11-11 11:40:09', 10);

DROP TABLE IF EXISTS `clase`;
CREATE TABLE `clase` (
  `id_clase` int NOT NULL AUTO_INCREMENT,
  `nombre_clase` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `capacidad_maxima` int NOT NULL,
  PRIMARY KEY (`id_clase`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `clase` (`id_clase`, `nombre_clase`, `descripcion`, `capacidad_maxima`) VALUES
(1, 'Yoga', 'dfghjklñ', 20),
(5, 'Spinning', 'Entrenamiento cardiovascular de alta intensidad en bicicleta estática', 25),
(6, 'CrossFit', 'Entrenamiento funcional de alta intensidad y fuerza', 20),
(7, 'Pilates', 'Control postural, flexibilidad y fortalecimiento del core', 15),
(8, 'Boxeo Fitness', 'Técnica de golpeo, agilidad y acondicionamiento aeróbico', 20),
(9, 'Zumba', 'Baile y ejercicio aeróbico con ritmos latinos', 30),
(10, 'Funcional GAP', 'Rutina focalizada en glúteos, abdomen y piernas', 25);

DROP TABLE IF EXISTS `cliente`;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cliente` (`id_cliente`, `codigo_miembro`, `fecha_nacimiento`, `contacto_emergencia`, `fk_usuario`) VALUES
(1, 'MIEM-DEMO-001', '1995-06-15', 'Mario Gutiérrez - 3009998877', 3),
(2, 'CLI-12', NULL, NULL, 12),
(3, 'CLI-13', NULL, NULL, 13),
(4, 'CLI-14', NULL, NULL, 14),
(5, 'CLI-15', NULL, NULL, 15),
(6, 'CLI-16', NULL, NULL, 16);

DROP TABLE IF EXISTS `detalle_rutina`;
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
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `detalle_rutina` (`id_detalle`, `dia_semana`, `series`, `repeticiones`, `descanso_segundos`, `fk_rutina`, `fk_ejercicio`) VALUES
(1, 'Lunes', 4, 12, 60, 1, 1),
(2, 'Lunes', 4, 10, 60, 2, 1),
(3, 'Lunes', 3, 12, 60, 2, 11),
(4, 'Miércoles', 4, 8, 90, 2, 7),
(5, 'Miércoles', 3, 8, 60, 2, 8),
(6, 'Viernes', 4, 10, 90, 2, 6),
(7, 'Viernes', 3, 45, 45, 2, 12),
(8, 'Lunes', 4, 15, 45, 3, 6),
(9, 'Lunes', 3, 60, 30, 3, 12),
(10, 'Miércoles', 3, 12, 60, 3, 9),
(11, 'Miércoles', 3, 15, 45, 3, 10),
(12, 'Viernes', 3, 12, 60, 3, 7),
(13, 'Viernes', 3, 10, 60, 3, 8),
(14, 'Lunes', 4, 8, 90, 4, 1),
(15, 'Lunes', 4, 10, 75, 4, 9),
(16, 'Miércoles', 4, 6, 120, 4, 7),
(17, 'Miércoles', 4, 8, 90, 4, 8),
(18, 'Viernes', 4, 8, 120, 4, 6),
(19, 'Viernes', 3, 10, 60, 4, 11),
(20, 'Martes', 3, 12, 60, 5, 6),
(21, 'Martes', 3, 12, 60, 5, 1),
(22, 'Jueves', 3, 8, 60, 5, 8),
(23, 'Jueves', 3, 12, 45, 5, 10),
(24, 'Sábado', 3, 10, 90, 5, 7),
(25, 'Sábado', 3, 40, 30, 5, 12),
(26, 'Lunes', 3, 10, 60, 6, 6),
(27, 'Lunes', 3, 10, 60, 6, 1),
(28, 'Miércoles', 3, 6, 60, 6, 8),
(29, 'Miércoles', 3, 10, 60, 6, 9),
(30, 'Viernes', 3, 8, 90, 6, 7),
(31, 'Viernes', 3, 30, 45, 6, 12);

DROP TABLE IF EXISTS `ejercicio`;
CREATE TABLE `ejercicio` (
  `id_ejercicio` int NOT NULL AUTO_INCREMENT,
  `nombre_ejercicio` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `grupo_muscular` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descripcion` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id_ejercicio`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ejercicio` (`id_ejercicio`, `nombre_ejercicio`, `grupo_muscular`, `descripcion`) VALUES
(1, 'Press banca', 'Pecho', 'Instruccion'),
(6, 'Sentadilla con barra', 'Piernas', 'Sentadilla clásica libre para fuerza en cuádriceps y glúteos'),
(7, 'Peso muerto', 'Espalda', 'Levantamiento de peso muerto con barra'),
(8, 'Dominadas', 'Espalda', 'Dominadas pronas en barra fija'),
(9, 'Press militar', 'Hombros', 'Press de hombros con barra por encima de la cabeza'),
(10, 'Curl de bíceps con mancuernas', 'Brazos', 'Flexión de codo alternada con mancuernas'),
(11, 'Fondos en paralelas', 'Tríceps', 'Fondos corporales en barras paralelas'),
(12, 'Plancha abdominal', 'Abdomen', 'Plancha isométrica sobre antebrazos');

DROP TABLE IF EXISTS `entrenador`;
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

INSERT INTO `entrenador` (`id_entrenador`, `especialidad`, `licencia_certificacion`, `turno_trabajo`, `fk_usuario`) VALUES
(1, 'Musculación', 'LIC-DEMO-001', 'Mañana', 2),
(2, NULL, NULL, NULL, 4),
(3, NULL, NULL, NULL, 5),
(4, NULL, NULL, NULL, 6);

DROP TABLE IF EXISTS `estado`;
CREATE TABLE `estado` (
  `id_estado` int NOT NULL AUTO_INCREMENT,
  `nombre_estado` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_estado`),
  UNIQUE KEY `uq_estado_nombre` (`nombre_estado`),
  CONSTRAINT `chk_estado_nombre` CHECK ((`nombre_estado` in (_utf8mb4'Activo',_utf8mb4'Inactivo')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `estado` (`id_estado`, `nombre_estado`) VALUES
(1, 'Activo'),
(2, 'Inactivo');

DROP TABLE IF EXISTS `ficha_tecnica`;
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

DROP TABLE IF EXISTS `membresia`;
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
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `membresia` (`id_membresia`, `fk_cliente`, `fk_plan`, `fecha_inicio`, `fecha_vencimiento`, `precio_pagado`, `ingresos_incluidos`, `estado_membresia`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 1, '2026-11-09', '2026-12-09', '80000.00', NULL, 'Cancelada', '2026-11-09 11:31:52', '2026-11-11 11:00:06'),
(2, 1, 4, '2026-11-09', '2027-02-07', '80000.00', 1, 'Cancelada', '2026-11-09 11:57:53', '2026-11-11 11:00:08'),
(5, 1, 1, '2026-11-11', '2026-12-11', '100000.00', NULL, 'Cancelada', '2026-11-11 10:53:41', '2026-11-11 16:41:40'),
(8, 2, 1, '2026-11-18', '2026-12-18', '80000.00', NULL, 'Activa', '2026-11-18 11:11:53', '2026-11-18 11:11:53'),
(9, 3, 2, '2026-11-18', '2027-11-13', '200000.00', 1, 'Activa', '2026-11-18 11:11:53', '2026-11-18 11:11:53'),
(10, 4, 4, '2026-11-18', '2027-02-16', '80000.00', 1, 'Activa', '2026-11-18 11:11:53', '2026-11-18 11:11:53'),
(11, 5, 1, '2026-11-18', '2026-12-18', '80000.00', NULL, 'Activa', '2026-11-18 11:11:53', '2026-11-18 11:11:53'),
(12, 6, 1, '2026-11-18', '2026-12-18', '80000.00', NULL, 'Activa', '2026-11-18 11:11:53', '2026-11-18 11:11:53');

DROP TABLE IF EXISTS `modulo`;
CREATE TABLE `modulo` (
  `id_modulo` int NOT NULL AUTO_INCREMENT,
  `nombre_modulo` varchar(60) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ruta` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_modulo`),
  UNIQUE KEY `uq_modulo_nombre` (`nombre_modulo`),
  UNIQUE KEY `uq_modulo_ruta` (`ruta`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `modulo` (`id_modulo`, `nombre_modulo`, `ruta`) VALUES
(1, 'Dashboard', '/dashboard'),
(2, 'Usuarios', '/usuarios'),
(3, 'Planes', '/admin/planes'),
(4, 'Membresías', '/admin/membresias'),
(5, 'Asistencias', '/admin/asistencias'),
(6, 'Ejercicios', '/admin/ejercicios'),
(7, 'Rutinas', '/admin/rutinas'),
(8, 'Clases', '/admin/clases'),
(9, 'Reportes', '/admin/reportes'),
(10, 'Mi Membresía', '/mi-membresia'),
(11, 'Mi Rutina', '/mi-rutina'),
(12, 'Mi Ficha Técnica', '/mi-ficha-tecnica'),
(13, 'Reservar Clase', '/reservar-clase'),
(14, 'Mis Reservas', '/mis-reservas');

DROP TABLE IF EXISTS `nivel_acceso`;
CREATE TABLE `nivel_acceso` (
  `id_nivel_acceso` int NOT NULL AUTO_INCREMENT,
  `nombre_nivel_acceso` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_nivel_acceso`),
  UNIQUE KEY `uq_nivel_acceso_nombre` (`nombre_nivel_acceso`),
  CONSTRAINT `chk_nivel_acceso_nombre` CHECK ((`nombre_nivel_acceso` in (_utf8mb4'Total',_utf8mb4'Limitado')))
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `nivel_acceso` (`id_nivel_acceso`, `nombre_nivel_acceso`) VALUES
(2, 'Limitado'),
(1, 'Total');

DROP TABLE IF EXISTS `pago`;
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `pago` (`id_pago`, `monto`, `fecha_pago`, `metodo_pago`, `estado_pago`, `fk_membresia`) VALUES
(1, '80000.00', '2026-11-09 11:31:52', 'Efectivo', 'Pagado', 1),
(2, '80000.00', '2026-11-09 11:57:53', 'Efectivo', 'Pagado', 2),
(3, '80000.00', '2026-11-18 11:11:53', 'Efectivo', 'Pagado', 8),
(4, '200000.00', '2026-11-18 11:11:53', 'Efectivo', 'Pagado', 9),
(5, '80000.00', '2026-11-18 11:11:53', 'Efectivo', 'Pagado', 10),
(6, '80000.00', '2026-11-18 11:11:53', 'Efectivo', 'Pagado', 11),
(7, '80000.00', '2026-11-18 11:11:53', 'Efectivo', 'Pagado', 12);

DROP TABLE IF EXISTS `perfil`;
CREATE TABLE `perfil` (
  `id_perfil` int NOT NULL AUTO_INCREMENT,
  `nombre_perfil` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_perfil`),
  UNIQUE KEY `uq_perfil_nombre` (`nombre_perfil`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `perfil` (`id_perfil`, `nombre_perfil`) VALUES
(1, 'Administrador'),
(3, 'Cliente'),
(2, 'Entrenador');

DROP TABLE IF EXISTS `perfil_modulo_permiso`;
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

INSERT INTO `perfil_modulo_permiso` (`id_perfil_modulo_permiso`, `fk_perfil`, `fk_modulo`, `fk_permiso`) VALUES
(8, 1, 1, 1),
(9, 1, 2, 1),
(5, 1, 3, 1),
(4, 1, 4, 1),
(1, 1, 5, 1),
(3, 1, 6, 1),
(7, 1, 7, 1),
(2, 1, 8, 1),
(6, 1, 9, 1),
(20, 2, 1, 1),
(17, 2, 6, 1),
(19, 2, 7, 1),
(16, 2, 8, 1),
(18, 2, 9, 1),
(23, 3, 1, 1),
(25, 3, 10, 1),
(26, 3, 11, 1),
(24, 3, 12, 1),
(28, 3, 13, 1),
(27, 3, 14, 1);

DROP TABLE IF EXISTS `permiso`;
CREATE TABLE `permiso` (
  `id_permiso` int NOT NULL AUTO_INCREMENT,
  `nombre_permiso` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_permiso`),
  UNIQUE KEY `uq_permiso_nombre` (`nombre_permiso`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `permiso` (`id_permiso`, `nombre_permiso`) VALUES
(1, 'Ver');

DROP TABLE IF EXISTS `plan`;
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

INSERT INTO `plan` (`id_plan`, `nombre_plan`, `descripcion`, `duracion_dias`, `precio`, `ingresos_incluidos`, `activo`, `creado_en`, `actualizado_en`) VALUES
(1, 'Plan Mensual Demo', 'Acceso ilimitado al gimnasio durante 30 días', 30, '80000.00', NULL, 1, '2026-10-06 01:46:08', '2026-11-10 09:59:25'),
(2, 'Anual', 'Acceso ilimitado un año', 360, '200000.00', 1, 1, '2026-11-09 11:54:15', '2026-11-09 11:55:24'),
(3, 'mensual', 'jjk', 30, '1000000.00', 1, 1, '2026-11-09 11:54:30', '2026-11-09 11:55:47'),
(4, 'trimestral', 'gfd', 90, '80000.00', 1, 1, '2026-11-09 11:55:05', '2026-11-09 11:55:33');

DROP TABLE IF EXISTS `programacion_clase`;
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `programacion_clase` (`id_programacion`, `fecha`, `hora_inicio`, `hora_fin`, `cupos_disponibles`, `fk_clase`, `fk_entrenador`) VALUES
(1, '2026-11-18', '07:00:00', '08:00:00', 25, 5, 1),
(2, '2026-11-18', '10:00:00', '11:00:00', 19, 1, 2),
(3, '2026-11-18', '18:00:00', '19:00:00', 20, 6, 3),
(4, '2026-11-19', '08:00:00', '09:00:00', 15, 7, 2),
(5, '2026-11-19', '17:00:00', '18:00:00', 20, 8, 4),
(6, '2026-11-19', '19:00:00', '20:00:00', 30, 9, 1),
(7, '2026-11-20', '07:00:00', '08:00:00', 25, 5, 1),
(8, '2026-11-20', '10:00:00', '11:00:00', 20, 1, 2),
(9, '2026-11-20', '18:00:00', '19:00:00', 20, 6, 3),
(10, '2026-11-23', '07:00:00', '08:00:00', 25, 5, 1),
(11, '2026-11-23', '10:00:00', '11:00:00', 20, 1, 2),
(12, '2026-11-23', '18:00:00', '19:00:00', 20, 6, 3),
(13, '2026-11-24', '08:00:00', '09:00:00', 15, 7, 2),
(14, '2026-11-24', '17:00:00', '18:00:00', 20, 8, 4),
(15, '2026-11-24', '19:00:00', '20:00:00', 30, 9, 1),
(16, '2026-11-25', '07:00:00', '08:00:00', 25, 5, 1),
(17, '2026-11-25', '10:00:00', '11:00:00', 20, 1, 2),
(18, '2026-11-25', '18:00:00', '19:00:00', 20, 6, 3),
(19, '2026-11-26', '08:00:00', '09:00:00', 15, 7, 2),
(20, '2026-11-26', '17:00:00', '18:00:00', 20, 8, 4),
(21, '2026-11-26', '19:00:00', '20:00:00', 30, 9, 1),
(22, '2026-11-27', '07:00:00', '08:00:00', 25, 5, 1),
(23, '2026-11-27', '10:00:00', '11:00:00', 20, 1, 2),
(24, '2026-11-27', '18:00:00', '19:00:00', 20, 6, 3);

DROP TABLE IF EXISTS `reserva_clase`;
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `reserva_clase` (`id_reserva`, `fecha_reserva`, `estado_reserva`, `fk_programacion`, `fk_cliente`) VALUES
(1, '2026-11-18 11:57:17', 'Confirmada', 2, 2);

DROP TABLE IF EXISTS `rol`;
CREATE TABLE `rol` (
  `id_rol` int NOT NULL AUTO_INCREMENT,
  `nombre_rol` enum('Administrador','Entrenador','Cliente') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_rol`),
  UNIQUE KEY `nombre_rol` (`nombre_rol`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rol` (`id_rol`, `nombre_rol`, `descripcion`) VALUES
(1, 'Cliente', 'Usuario cliente del gimnasio'),
(2, 'Administrador', 'Acceso completo al sistema'),
(3, 'Entrenador', 'Gestion de rutinas y clases');

DROP TABLE IF EXISTS `rutina`;
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `rutina` (`id_rutina`, `nombre_rutina`, `objetivo`, `fecha_inicio`, `fecha_fin`, `estado`, `fk_cliente`, `fk_entrenador`) VALUES
(1, 'Fuerza', 'Acondicionamiento', '2026-11-09', '2026-11-11', 'Activa', 1, 3),
(2, 'Acondicionamiento General - Carlos', 'Fuerza general e iniciación en pesas', '2026-11-18', '2027-01-17', 'Activa', 2, 1),
(3, 'Tonificación y Resistencia - Laura', 'Resistencia muscular y definición', '2026-11-18', '2027-01-17', 'Activa', 3, 2),
(4, 'Fuerza e Hipertrofia - Andrés', 'Aumento de masa muscular', '2026-11-18', '2027-01-17', 'Activa', 4, 1),
(5, 'Full Body Funcional - Sofía', 'Movilidad, fuerza y quema calórica', '2026-11-18', '2027-01-17', 'Activa', 5, 3),
(6, 'Iniciación al Entrenamiento - Mateo', 'Aprender patrones básicos de movimiento', '2026-11-18', '2027-01-17', 'Activa', 6, 2);

DROP TABLE IF EXISTS `usuario`;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `usuario` (`id_usuario`, `nombre`, `apellido`, `documento_identidad`, `correo`, `contrasena`, `intentos_fallidos`, `bloqueado_hasta`, `telefono`, `fk_estado`, `fecha_registro`, `fk_rol`, `fk_perfil`) VALUES
(2, 'Andrés', 'Mendoza', '80456123', 'entrenador@gimnasio.com', '$2b$12$gkYhRH0Zp5TOlxfciUIDguttQzetHRzYP9DGrVkttpFpnGBUmc412', 0, NULL, '3204445566', 1, '2026-10-06 01:46:08', 3, 2),
(3, 'Sofía', 'Gutiérrez', '1020304050', 'cliente@gimnasio.com', '$2b$12$gkYhRH0Zp5TOlxfciUIDguttQzetHRzYP9DGrVkttpFpnGBUmc412', 0, NULL, '3157778899', 1, '2026-10-06 01:46:08', 1, 3),
(4, 'Cristina', 'restrepo', '1040357219', 'kristinadepor@gmail.com', '$2b$12$o63xkRlOdTJLVOIIOHCas.h6mP9ryJi4Bmx4AKqf7ziy3Tl9n3R8K', 0, NULL, '3202295752', 1, '2026-10-06 09:52:53', 3, 2),
(5, 'michael', 'polo', '1040357218', 'polo@gmail.com', '$2b$12$Tg8EbchUoY7rWy6xMxI6KOf.UkfKrPqi7TO86kb5dS7SOPChlUJEK', 0, NULL, '3202295755', 1, '2026-10-06 09:54:57', 3, 2),
(6, 'jemilson', 'solano', '1040357222', 'sol@gmail.com', '$2b$12$3wAwVSeFByfQPbl2.N/XIeugNnB1dQuvXZGwSNi/nucYAWSCsx/Qe', 0, NULL, '3202295720', 1, '2026-10-06 09:58:04', 3, 2),
(7, 'A', 'B', '123', 'a@a.net', '12345678', 2, NULL, '321456978', 1, '2026-11-09 10:30:19', 2, 1),
(9, 'Admin', 'Gimnasio', '1234567890', 'admin@gimnasio.com', '$2b$12$9C0aWyZkISpVAW2KkE3da.Fy9iHwrMp59RBgm.Ag7mCQLJWPFdXRq', 1, NULL, '3001234567', 1, '2026-11-09 10:44:52', 2, 1),
(10, 'Admin2', 'Gimnasio', '0987654321', 'admin2@gimnasio.com', '$2b$12$LKz2XxSopCj5Ns/74z01LeBxpHBnGOTzK0NOuDji/pyaRmgT3FMfm', 0, NULL, '3109876543', 1, '2026-11-09 11:26:03', 2, 1),
(12, 'Carlos', 'Mendoza', '1098765431', 'carlos.mendoza@ejemplo.com', '$2b$12$GmnaucODcdTOfG1dKH2X7.X.ksRVr60q7nxYQS5yFOXerY2YVoPte', 0, NULL, '3001112233', 1, '2026-11-18 10:48:21', 1, 3),
(13, 'Laura', 'Gomez', '1098765432', 'laura.gomez@ejemplo.com', '$2b$12$DPw7eMeoXqTyJIvVen4P0.UhPOOU8JatT8h2qs11IcsHmwbp5RNdm', 0, NULL, '3002223344', 1, '2026-11-18 10:48:22', 1, 3),
(14, 'Andres', 'Perez', '1098765433', 'andres.perez@ejemplo.com', '$2b$12$ugvV.Iba/6TSgV4uyht4wurpTrO0fmMiRAQRjt5ar8KpSSYG80cfe', 0, NULL, '3003334455', 1, '2026-11-18 10:48:22', 1, 3),
(15, 'Sofia', 'Rodriguez', '1098765434', 'sofia.rodriguez@ejemplo.com', '$2b$12$hBf/JHwDvgbtxX1.OgkquOJk0cLdkPvSGJgdPksCWM1bwGUNcgvHm', 0, NULL, '3004445566', 1, '2026-11-18 10:48:22', 1, 3),
(16, 'Mateo', 'Herrera', '1098765435', 'mateo.herrera@ejemplo.com', '$2b$12$SVvfj6Y1Yw7dk363A6JOk.dcv.22tB9Pw20BuO/0DocqDA4iyY6Wi', 0, NULL, '3005556677', 1, '2026-11-18 10:48:23', 1, 3);

SET FOREIGN_KEY_CHECKS=1;
