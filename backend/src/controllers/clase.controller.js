import {
  actualizarClase,
  buscarClasePorId,
  buscarClasePorNombre,
  contarProgramacionesDeClase,
  crearClase,
  eliminarClase,
  listarClases
} from '../models/clase.model.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

export async function obtenerClasesController(req, res, next) {
  try {
    const clases = await listarClases();
    return successResponse(res, 200, 'Clases obtenidas correctamente', clases);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerClasePorIdController(req, res, next) {
  const idClase = Number(req.params.id);
  if (isNaN(idClase) || idClase <= 0) {
    return errorResponse(res, 400, 'El ID de clase no es válido', 'INVALID_ID');
  }

  try {
    const clase = await buscarClasePorId(idClase);
    if (!clase) {
      return errorResponse(res, 404, 'Clase no encontrada', 'CLASE_NOT_FOUND');
    }
    return successResponse(res, 200, 'Clase obtenida correctamente', clase);
  } catch (error) {
    return next(error);
  }
}

export async function crearClaseController(req, res, next) {
  const { nombre_clase, descripcion, capacidad_maxima } = req.body;

  if (!nombre_clase || String(nombre_clase).trim() === '') {
    return errorResponse(res, 400, 'El nombre de la clase es obligatorio', 'VALIDATION_ERROR');
  }

  const capacidad = Number(capacidad_maxima);
  if (isNaN(capacidad) || capacidad <= 0) {
    return errorResponse(res, 400, 'La capacidad máxima debe ser un número mayor a 0', 'VALIDATION_ERROR');
  }

  try {
    const duplicada = await buscarClasePorNombre(nombre_clase);
    if (duplicada) {
      return errorResponse(
        res,
        409,
        `Ya existe una clase con el nombre "${nombre_clase.trim()}"`,
        'CLASE_ALREADY_EXISTS'
      );
    }

    const nuevaClase = await crearClase({
      nombre_clase: String(nombre_clase).trim(),
      descripcion: descripcion ? String(descripcion).trim() : null,
      capacidad_maxima: capacidad
    });
    return successResponse(res, 201, 'Clase creada exitosamente', nuevaClase);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarClaseController(req, res, next) {
  const idClase = Number(req.params.id);
  if (isNaN(idClase) || idClase <= 0) {
    return errorResponse(res, 400, 'El ID de clase no es válido', 'INVALID_ID');
  }

  const { nombre_clase, descripcion, capacidad_maxima } = req.body;

  try {
    const existente = await buscarClasePorId(idClase);
    if (!existente) {
      return errorResponse(res, 404, 'Clase no encontrada', 'CLASE_NOT_FOUND');
    }

    if (nombre_clase !== undefined) {
      if (!nombre_clase || String(nombre_clase).trim() === '') {
        return errorResponse(res, 400, 'El nombre de la clase no puede estar vacío', 'VALIDATION_ERROR');
      }

      const duplicada = await buscarClasePorNombre(nombre_clase, idClase);
      if (duplicada) {
        return errorResponse(
          res,
          409,
          `Ya existe otra clase con el nombre "${nombre_clase.trim()}"`,
          'CLASE_ALREADY_EXISTS'
        );
      }
    }

    if (capacidad_maxima !== undefined) {
      const cap = Number(capacidad_maxima);
      if (isNaN(cap) || cap <= 0) {
        return errorResponse(res, 400, 'La capacidad máxima debe ser un número mayor a 0', 'VALIDATION_ERROR');
      }
    }

    const actualizada = await actualizarClase(idClase, {
      nombre_clase: nombre_clase !== undefined ? String(nombre_clase).trim() : undefined,
      descripcion: descripcion !== undefined ? (descripcion ? String(descripcion).trim() : null) : undefined,
      capacidad_maxima: capacidad_maxima !== undefined ? Number(capacidad_maxima) : undefined
    });

    return successResponse(res, 200, 'Clase actualizada exitosamente', actualizada);
  } catch (error) {
    return next(error);
  }
}

export async function eliminarClaseController(req, res, next) {
  const idClase = Number(req.params.id);
  if (isNaN(idClase) || idClase <= 0) {
    return errorResponse(res, 400, 'El ID de clase no es válido', 'INVALID_ID');
  }

  try {
    const existente = await buscarClasePorId(idClase);
    if (!existente) {
      return errorResponse(res, 404, 'Clase no encontrada', 'CLASE_NOT_FOUND');
    }

    const totalProgramaciones = await contarProgramacionesDeClase(idClase);
    if (totalProgramaciones > 0) {
      return errorResponse(
        res,
        409,
        `No se puede eliminar la clase porque tiene ${totalProgramaciones} programación(es) registrada(s)`,
        'CLASS_IN_USE'
      );
    }

    await eliminarClase(idClase);
    return successResponse(res, 200, 'Clase eliminada exitosamente', { id_clase: idClase });
  } catch (error) {
    return next(error);
  }
}
