import { Router } from 'express';
import {
  actualizarClaseController,
  crearClaseController,
  eliminarClaseController,
  obtenerClasePorIdController,
  obtenerClasesController
} from '../controllers/clase.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from '../middlewares/role.middleware.js';
import { validarCamposRequeridos } from '../middlewares/validation.middleware.js';

const router = Router();

router.get('/', autenticarUsuario, obtenerClasesController);
router.get('/:id', autenticarUsuario, obtenerClasePorIdController);

router.post(
  '/',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  validarCamposRequeridos(['nombre_clase', 'capacidad_maxima']),
  crearClaseController
);

router.put(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  actualizarClaseController
);

router.delete(
  '/:id',
  autenticarUsuario,
  autorizarRoles('Administrador', 'Entrenador'),
  eliminarClaseController
);

export default router;
