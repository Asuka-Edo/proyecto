import { Router } from 'express';
import {
  actualizarDetalleController,
  actualizarRutinaController,
  agregarDetalleController,
  crearRutinaController,
  eliminarDetalleController,
  eliminarRutinaController,
  obtenerDetallesController,
  obtenerRutinaPorIdController,
  obtenerRutinasPorCliente,
  obtenerTodasRutinas
} from '../controllers/rutina.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from '../middlewares/role.middleware.js';
import { validarCamposRequeridos } from '../middlewares/validation.middleware.js';

const router = Router();

router.get(
  '/',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  obtenerTodasRutinas
);

router.get(
  '/cliente/:id_usuario',
  autenticarUsuario,
  obtenerRutinasPorCliente
);

router.get(
  '/:id',
  autenticarUsuario,
  obtenerRutinaPorIdController
);

router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  validarCamposRequeridos(['fk_cliente', 'nombre_rutina']),
  crearRutinaController
);

router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  actualizarRutinaController
);

router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  eliminarRutinaController
);

router.post(
  '/:id/detalles',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  validarCamposRequeridos(['fk_ejercicio', 'dia_semana', 'series', 'repeticiones']),
  agregarDetalleController
);

router.get(
  '/:id/detalles',
  autenticarUsuario,
  obtenerDetallesController
);

router.put(
  '/detalles/:id_detalle',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  actualizarDetalleController
);

router.delete(
  '/detalles/:id_detalle',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  eliminarDetalleController
);

export default router;
