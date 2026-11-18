import { Router } from 'express';
import {
  actualizarProgramacionController,
  crearProgramacionController,
  eliminarProgramacionController,
  obtenerProgramacionPorIdController,
  obtenerProgramacionesController,
  obtenerReservasDeProgramacionController
} from '../controllers/programacion_clase.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from '../middlewares/role.middleware.js';
import { validarCamposRequeridos } from '../middlewares/validation.middleware.js';

const router = Router();

router.get('/', autenticarUsuario, obtenerProgramacionesController);
router.get('/:id', autenticarUsuario, obtenerProgramacionPorIdController);

router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  validarCamposRequeridos(['fk_clase', 'fecha', 'hora_inicio', 'hora_fin', 'cupos_disponibles']),
  crearProgramacionController
);

router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  actualizarProgramacionController
);

router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  eliminarProgramacionController
);

router.get(
  '/:id/reservas',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  obtenerReservasDeProgramacionController
);

export default router;
