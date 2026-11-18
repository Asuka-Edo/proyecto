import { Router } from 'express';
import {
  actualizarEjercicioController,
  crearEjercicioController,
  eliminarEjercicioController,
  obtenerEjercicioPorIdController,
  obtenerEjercicios
} from '../controllers/ejercicio.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from '../middlewares/role.middleware.js';
import { validarCamposRequeridos } from '../middlewares/validation.middleware.js';

const router = Router();

router.get('/', autenticarUsuario, obtenerEjercicios);
router.get('/:id', autenticarUsuario, obtenerEjercicioPorIdController);

router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  validarCamposRequeridos(['nombre_ejercicio', 'grupo_muscular']),
  crearEjercicioController
);

router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  actualizarEjercicioController
);

router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  eliminarEjercicioController
);

export default router;
