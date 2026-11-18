import {
  actualizarEjercicio,
  buscarEjercicioPorId,
  buscarEjercicioPorNombre,
  contarUsosEnRutinas,
  crearEjercicio,
  eliminarEjercicio,
  listarEjercicios
} from '../models/ejercicio.model.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export async function obtenerEjercicios(req, res, next) {
  try {
    const ejercicios = await listarEjercicios();
    return successResponse(res, 200, 'Ejercicios obtenidos correctamente', ejercicios);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerEjercicioPorIdController(req, res, next) {
  try {
    const idEjercicio = Number(req.params.id);
    if (isNaN(idEjercicio) || idEjercicio <= 0) {
      return errorResponse(res, 400, 'El ID de ejercicio no es válido', 'INVALID_ID');
    }

    const ejercicio = await buscarEjercicioPorId(idEjercicio);
    if (!ejercicio) {
      return errorResponse(res, 404, 'Ejercicio no encontrado', 'EJERCICIO_NOT_FOUND');
    }

    return successResponse(res, 200, 'Ejercicio obtenido correctamente', ejercicio);
  } catch (error) {
    return next(error);
  }
}

export async function crearEjercicioController(req, res, next) {
  const { nombre_ejercicio, grupo_muscular, descripcion } = req.body;

  if (!nombre_ejercicio || String(nombre_ejercicio).trim() === '') {
    return errorResponse(res, 400, 'El nombre del ejercicio es obligatorio', 'VALIDATION_ERROR');
  }

  if (!grupo_muscular || String(grupo_muscular).trim() === '') {
    return errorResponse(res, 400, 'El grupo muscular es obligatorio', 'VALIDATION_ERROR');
  }

  try {
    const duplicado = await buscarEjercicioPorNombre(nombre_ejercicio);
    if (duplicado) {
      return errorResponse(
        res,
        409,
        `Ya existe un ejercicio registrado con el nombre "${nombre_ejercicio.trim()}"`,
        'EJERCICIO_ALREADY_EXISTS'
      );
    }

    const nuevoEjercicio = await crearEjercicio({
      nombre_ejercicio: String(nombre_ejercicio).trim(),
      grupo_muscular: String(grupo_muscular).trim(),
      descripcion: descripcion ? String(descripcion).trim() : null
    });

    return successResponse(res, 201, 'Ejercicio creado exitosamente', nuevoEjercicio);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarEjercicioController(req, res, next) {
  const idEjercicio = Number(req.params.id);
  if (isNaN(idEjercicio) || idEjercicio <= 0) {
    return errorResponse(res, 400, 'El ID de ejercicio no es válido', 'INVALID_ID');
  }

  const { nombre_ejercicio, grupo_muscular, descripcion } = req.body;

  try {
    const existente = await buscarEjercicioPorId(idEjercicio);
    if (!existente) {
      return errorResponse(res, 404, 'Ejercicio no encontrado', 'EJERCICIO_NOT_FOUND');
    }

    if (nombre_ejercicio !== undefined) {
      if (!nombre_ejercicio || String(nombre_ejercicio).trim() === '') {
        return errorResponse(res, 400, 'El nombre del ejercicio no puede estar vacío', 'VALIDATION_ERROR');
      }

      const duplicado = await buscarEjercicioPorNombre(nombre_ejercicio, idEjercicio);
      if (duplicado) {
        return errorResponse(
          res,
          409,
          `Ya existe otro ejercicio registrado con el nombre "${nombre_ejercicio.trim()}"`,
          'EJERCICIO_ALREADY_EXISTS'
        );
      }
    }

    if (grupo_muscular !== undefined && (!grupo_muscular || String(grupo_muscular).trim() === '')) {
      return errorResponse(res, 400, 'El grupo muscular no puede estar vacío', 'VALIDATION_ERROR');
    }

    const actualizado = await actualizarEjercicio(idEjercicio, {
      nombre_ejercicio: nombre_ejercicio !== undefined ? String(nombre_ejercicio).trim() : undefined,
      grupo_muscular: grupo_muscular !== undefined ? String(grupo_muscular).trim() : undefined,
      descripcion: descripcion !== undefined ? (descripcion ? String(descripcion).trim() : null) : undefined
    });

    return successResponse(res, 200, 'Ejercicio actualizado exitosamente', actualizado);
  } catch (error) {
    return next(error);
  }
}

export async function eliminarEjercicioController(req, res, next) {
  const idEjercicio = Number(req.params.id);
  if (isNaN(idEjercicio) || idEjercicio <= 0) {
    return errorResponse(res, 400, 'El ID de ejercicio no es válido', 'INVALID_ID');
  }

  try {
    const existente = await buscarEjercicioPorId(idEjercicio);
    if (!existente) {
      return errorResponse(res, 404, 'Ejercicio no encontrado', 'EJERCICIO_NOT_FOUND');
    }

    const usos = await contarUsosEnRutinas(idEjercicio);
    if (usos > 0) {
      return errorResponse(
        res,
        409,
        `No se puede eliminar el ejercicio porque está asignado en ${usos} rutina(s)`,
        'EXERCISE_IN_USE'
      );
    }

    await eliminarEjercicio(idEjercicio);
    return successResponse(res, 200, 'Ejercicio eliminado exitosamente', { id_ejercicio: idEjercicio });
  } catch (error) {
    return next(error);
  }
}
