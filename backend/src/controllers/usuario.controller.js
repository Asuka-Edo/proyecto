import {
	actualizarUsuario,
	buscarUsuarioPorId,
	cambiarEstadoUsuario,
	desbloquearUsuario,
	listarUsuarios
} from '../models/usuario.model.js';
import { crearUsuarioConExtension } from '../models/autenticacion.model.js';
import { errorResponse, successResponse } from '../utils/api-response.js';
import { normalizarContacto, validarDatosContacto } from '../validations/autenticacion.validation.js';

export async function obtenerUsuarios(req, res, next) {
	try {
		const parametroBusqueda = req.query.busqueda ?? req.query.q;
		const busqueda = typeof parametroBusqueda === 'string' ? parametroBusqueda.trim().slice(0, 100) : '';
		const soloClientes = req.usuarioAutenticado?.nombre_rol === 'Entrenador';
		const usuarios = await listarUsuarios({ busqueda, soloClientes });
		return successResponse(res, 200, 'Usuarios obtenidos correctamente', usuarios);
	} catch (error) {
		return next(error);
	}
}

export async function obtenerUsuarioPorIdController(req, res, next) {
	try {
		const idUsuario = Number(req.params.id);
		if (isNaN(idUsuario) || idUsuario <= 0) {
			return errorResponse(res, 400, 'El ID de usuario no es válido', 'INVALID_ID');
		}

		const usuario = await buscarUsuarioPorId(idUsuario);
		if (!usuario) {
			return errorResponse(res, 404, 'Usuario no encontrado', 'USER_NOT_FOUND');
		}

		return successResponse(res, 200, 'Usuario obtenido correctamente', usuario);
	} catch (error) {
		return next(error);
	}
}

export async function crearUsuarioController(req, res, next) {
	try {
		const contacto = normalizarContacto(req.body);
		const errores = validarDatosContacto(contacto);
		if (errores.length > 0) {
			return errorResponse(res, 400, 'Datos inválidos', 'VALIDATION_ERROR', errores);
		}

		const usuario = await crearUsuarioConExtension({
			nombre: req.body.nombre.trim(),
			apellido: req.body.apellido.trim(),
			documentoIdentidad: contacto.documento_identidad,
			correo: contacto.correo,
			contrasena: req.body.contrasena,
			telefono: contacto.telefono,
			nombreRol: req.body.nombre_rol,
			codigoMiembro: req.body.codigo_miembro?.trim()
		});

		return successResponse(res, 201, 'Usuario creado correctamente', usuario);
	} catch (error) {
		if (error.code === 'EMAIL_ALREADY_EXISTS' || error.code === 'DOCUMENT_ALREADY_EXISTS') {
			return errorResponse(res, 409, error.message, error.code);
		}
		if (error.code === 'ER_DUP_ENTRY') {
			return errorResponse(res, 409, 'El documento o correo ya está registrado', 'DUPLICATE_USER');
		}
		if (error.code === 'ROLE_NOT_FOUND') {
			return errorResponse(res, 400, error.message, error.code);
		}
		if (error.code === 'NIVEL_ACCESO_NOT_FOUND') {
			return errorResponse(
				res,
				500,
				'No se puede crear el administrador: falta el nivel de acceso "Total" en la base de datos. Contacte al responsable del sistema.',
				error.code
			);
		}
		return next(error);
	}
}

export async function actualizarUsuarioController(req, res, next) {
	try {
		const idUsuario = Number(req.params.id);
		if (isNaN(idUsuario) || idUsuario <= 0) {
			return errorResponse(res, 400, 'El ID de usuario no es válido', 'INVALID_ID');
		}

		const contacto = normalizarContacto(req.body);
		const errores = validarDatosContacto(contacto);
		if (errores.length > 0) {
			return errorResponse(res, 400, 'Datos de contacto inválidos', 'VALIDATION_ERROR', errores);
		}

		const usuarioActualizado = await actualizarUsuario(idUsuario, {
			nombre: req.body.nombre !== undefined ? req.body.nombre.trim() : undefined,
			apellido: req.body.apellido !== undefined ? req.body.apellido.trim() : undefined,
			documento_identidad: contacto.documento_identidad,
			correo: contacto.correo,
			telefono: contacto.telefono,
			codigo_miembro: req.body.codigo_miembro !== undefined ? req.body.codigo_miembro.trim() : undefined
		});

		if (!usuarioActualizado) {
			return errorResponse(res, 404, 'Usuario no encontrado', 'USER_NOT_FOUND');
		}

		return successResponse(res, 200, 'Usuario actualizado correctamente', usuarioActualizado);
	} catch (error) {
		if (error.code === 'EMAIL_ALREADY_EXISTS' || error.code === 'DOCUMENT_ALREADY_EXISTS') {
			return errorResponse(res, 409, error.message, error.code);
		}
		if (error.code === 'ER_DUP_ENTRY') {
			return errorResponse(res, 409, 'El documento o correo ya está registrado', 'DUPLICATE_USER');
		}
		return next(error);
	}
}

export async function actualizarEstadoUsuario(req, res, next) {
	const estado = req.body?.estado;

	if (!['Activo', 'Inactivo'].includes(estado)) {
		return errorResponse(
			res,
			400,
			"El estado debe ser 'Activo' o 'Inactivo'",
			'VALIDATION_ERROR'
		);
	}

	try {
		const filasActualizadas = await cambiarEstadoUsuario(req.params.id, estado);

		if (filasActualizadas === 0) {
			return errorResponse(res, 404, 'Usuario no encontrado', 'USER_NOT_FOUND');
		}

		return successResponse(res, 200, 'Estado del usuario actualizado correctamente', {
			id_usuario: Number(req.params.id),
			estado
		});
	} catch (error) {
		return next(error);
	}
}

export async function desbloquearUsuarioController(req, res, next) {
	try {
		const filasActualizadas = await desbloquearUsuario(req.params.id);

		if (filasActualizadas === 0) {
			return errorResponse(res, 404, 'Usuario no encontrado', 'USER_NOT_FOUND');
		}

		return successResponse(res, 200, 'Usuario desbloqueado correctamente', {
			id_usuario: Number(req.params.id)
		});
	} catch (error) {
		return next(error);
	}
}
