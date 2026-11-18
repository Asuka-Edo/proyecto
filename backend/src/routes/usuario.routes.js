import { Router } from 'express';
import {
	actualizarEstadoUsuario,
	actualizarUsuarioController,
	crearUsuarioController,
	desbloquearUsuarioController,
	obtenerUsuarioPorIdController,
	obtenerUsuarios
} from '../controllers/usuario.controller.js';
import { autenticarUsuario } from '../middlewares/auth.middleware.js';
import { autorizarRoles } from '../middlewares/role.middleware.js';
import { validarCamposRequeridos } from '../middlewares/validation.middleware.js';

const usuarioRoutes = Router();

usuarioRoutes.use(autenticarUsuario);

// Administradores y entrenadores pueden consultar usuarios. Para los entrenadores,
// el controlador limita los resultados a perfiles con rol Cliente.
usuarioRoutes.get('/', autorizarRoles('Administrador', 'Entrenador'), obtenerUsuarios);

// Las operaciones de administración siguen reservadas exclusivamente al administrador.
usuarioRoutes.use(autorizarRoles('Administrador'));
usuarioRoutes.get('/:id', obtenerUsuarioPorIdController);
usuarioRoutes.post(
	'/',
	validarCamposRequeridos(['nombre', 'apellido', 'documento_identidad', 'correo', 'contrasena', 'nombre_rol']),
	crearUsuarioController
);
usuarioRoutes.put('/:id', actualizarUsuarioController);
usuarioRoutes.patch('/:id/estado', actualizarEstadoUsuario);
usuarioRoutes.patch('/:id/desbloquear', desbloquearUsuarioController);

export default usuarioRoutes;
