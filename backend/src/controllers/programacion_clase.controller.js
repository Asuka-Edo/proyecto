import {
  actualizarProgramacion,
  buscarProgramacionPorId,
  contarReservasDeProgramacion,
  crearProgramacion,
  eliminarProgramacion,
  listarProgramaciones,
  listarProgramacionesFuturas,
  verificarSolapamientoEntrenador
} from '../models/programacion_clase.model.js';
import { buscarClasePorId } from '../models/clase.model.js';
import { buscarEntrenadorPorId, buscarEntrenadorPorUsuario } from '../models/entrenador.model.js';
import { listarReservasPorProgramacion } from '../models/reserva_clase.model.js';
import { errorResponse, successResponse } from '../utils/api-response.js';

// Regex para validar formato HH:MM o HH:MM:SS
const HORA_REGEX = /^\d{2}:\d{2}(:\d{2})?$/;
// Regex para validar formato YYYY-MM-DD
const FECHA_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export async function obtenerProgramacionesController(req, res, next) {
  try {
    const { futuras } = req.query;
    const programaciones = futuras === 'true'
      ? await listarProgramacionesFuturas()
      : await listarProgramaciones();
    return successResponse(res, 200, 'Programaciones obtenidas correctamente', programaciones);
  } catch (error) {
    return next(error);
  }
}

export async function obtenerProgramacionPorIdController(req, res, next) {
  const idProgramacion = Number(req.params.id);
  if (isNaN(idProgramacion) || idProgramacion <= 0) {
    return errorResponse(res, 400, 'El ID de programación no es válido', 'INVALID_ID');
  }

  try {
    const programacion = await buscarProgramacionPorId(idProgramacion);
    if (!programacion) {
      return errorResponse(res, 404, 'Programación no encontrada', 'PROGRAMACION_NOT_FOUND');
    }
    return successResponse(res, 200, 'Programación obtenida correctamente', programacion);
  } catch (error) {
    return next(error);
  }
}

export async function crearProgramacionController(req, res, next) {
  const { fk_clase, fecha, hora_inicio, hora_fin, cupos_disponibles } = req.body;

  const idClase = Number(fk_clase);
  if (isNaN(idClase) || idClase <= 0) {
    return errorResponse(res, 400, 'El ID de clase (fk_clase) no es válido', 'VALIDATION_ERROR');
  }

  if (!fecha || !FECHA_REGEX.test(fecha)) {
    return errorResponse(res, 400, 'La fecha debe tener formato YYYY-MM-DD', 'VALIDATION_ERROR');
  }

  if (!hora_inicio || !HORA_REGEX.test(hora_inicio)) {
    return errorResponse(res, 400, 'hora_inicio debe tener formato HH:MM', 'VALIDATION_ERROR');
  }

  if (!hora_fin || !HORA_REGEX.test(hora_fin)) {
    return errorResponse(res, 400, 'hora_fin debe tener formato HH:MM', 'VALIDATION_ERROR');
  }

  if (hora_fin <= hora_inicio) {
    return errorResponse(res, 400, 'hora_fin debe ser posterior a hora_inicio', 'VALIDATION_ERROR');
  }

  const cupos = Number(cupos_disponibles);
  if (isNaN(cupos) || cupos <= 0) {
    return errorResponse(res, 400, 'Los cupos disponibles deben ser un número mayor a 0', 'VALIDATION_ERROR');
  }

  try {
    // Verificar clase
    const clase = await buscarClasePorId(idClase);
    if (!clase) {
      return errorResponse(res, 404, 'La clase no existe', 'CLASE_NOT_FOUND');
    }

    // Validar que cupos no supere capacidad_maxima
    if (cupos > clase.capacidad_maxima) {
      return errorResponse(
        res,
        400,
        `Los cupos disponibles no pueden superar la capacidad máxima de la clase (${clase.capacidad_maxima})`,
        'VALIDATION_ERROR'
      );
    }

    // Determinar fk_entrenador según rol
    let idEntrenador;
    const usuarioAuth = req.usuarioAutenticado;

    if (usuarioAuth.nombre_rol === 'Entrenador') {
      const perfilEntrenador = await buscarEntrenadorPorUsuario(usuarioAuth.id_usuario);
      if (!perfilEntrenador) {
        return errorResponse(
          res,
          404,
          'El usuario no tiene un perfil de entrenador asociado',
          'ENTRENADOR_PROFILE_NOT_FOUND'
        );
      }
      idEntrenador = perfilEntrenador.id_entrenador;
    } else {
      // Administrador: debe proporcionar fk_entrenador
      const fkEntrenadorBody = Number(req.body.fk_entrenador);
      if (isNaN(fkEntrenadorBody) || fkEntrenadorBody <= 0) {
        return errorResponse(
          res,
          400,
          'El ID de entrenador (fk_entrenador) es obligatorio para administradores',
          'VALIDATION_ERROR'
        );
      }

      const perfilEntrenador = await buscarEntrenadorPorId(fkEntrenadorBody);
      if (!perfilEntrenador) {
        return errorResponse(res, 404, 'El entrenador seleccionado no existe', 'ENTRENADOR_PROFILE_NOT_FOUND');
      }
      idEntrenador = perfilEntrenador.id_entrenador;
    }

    // Validar conflicto de horario del entrenador
    const conflicto = await verificarSolapamientoEntrenador({
      fk_entrenador: idEntrenador,
      fecha,
      hora_inicio,
      hora_fin
    });
    if (conflicto) {
      return errorResponse(
        res,
        409,
        `El entrenador ya tiene asignada la clase "${conflicto.nombre_clase}" de ${conflicto.hora_inicio} a ${conflicto.hora_fin} en esa fecha`,
        'TRAINER_SCHEDULE_CONFLICT'
      );
    }

    const nuevaProgramacion = await crearProgramacion({
      fk_clase: idClase,
      fk_entrenador: idEntrenador,
      fecha,
      hora_inicio,
      hora_fin,
      cupos_disponibles: cupos
    });

    return successResponse(res, 201, 'Programación creada exitosamente', nuevaProgramacion);
  } catch (error) {
    return next(error);
  }
}

export async function actualizarProgramacionController(req, res, next) {
  const idProgramacion = Number(req.params.id);
  if (isNaN(idProgramacion) || idProgramacion <= 0) {
    return errorResponse(res, 400, 'El ID de programación no es válido', 'INVALID_ID');
  }

  const { fk_clase, fk_entrenador, fecha, hora_inicio, hora_fin, cupos_disponibles } = req.body;

  try {
    const existente = await buscarProgramacionPorId(idProgramacion);
    if (!existente) {
      return errorResponse(res, 404, 'Programación no encontrada', 'PROGRAMACION_NOT_FOUND');
    }

    const fechaFinal = fecha !== undefined ? fecha : existente.fecha;
    const horaInicioFinal = hora_inicio !== undefined ? hora_inicio : existente.hora_inicio;
    const horaFinFinal = hora_fin !== undefined ? hora_fin : existente.hora_fin;
    const entrenadorFinal = fk_entrenador !== undefined ? Number(fk_entrenador) : existente.fk_entrenador;
    const claseFinal = fk_clase !== undefined ? Number(fk_clase) : existente.fk_clase;

    if (hora_fin !== undefined || hora_inicio !== undefined) {
      if (horaFinFinal <= horaInicioFinal) {
        return errorResponse(res, 400, 'hora_fin debe ser posterior a hora_inicio', 'VALIDATION_ERROR');
      }
    }

    // Validar solapamiento
    const conflicto = await verificarSolapamientoEntrenador({
      fk_entrenador: entrenadorFinal,
      fecha: fechaFinal,
      hora_inicio: horaInicioFinal,
      hora_fin: horaFinFinal,
      excludeId: idProgramacion
    });
    if (conflicto) {
      return errorResponse(
        res,
        409,
        `El entrenador ya tiene asignada la clase "${conflicto.nombre_clase}" de ${conflicto.hora_inicio} a ${conflicto.hora_fin} en esa fecha`,
        'TRAINER_SCHEDULE_CONFLICT'
      );
    }

    let cuposFinales = existente.cupos_disponibles;
    if (cupos_disponibles !== undefined) {
      const c = Number(cupos_disponibles);
      if (isNaN(c) || c < 0) {
        return errorResponse(res, 400, 'Los cupos deben ser un número mayor o igual a 0', 'VALIDATION_ERROR');
      }
      cuposFinales = c;
    }

    const actualizada = await actualizarProgramacion(idProgramacion, {
      fk_clase: claseFinal,
      fk_entrenador: entrenadorFinal,
      fecha: fechaFinal,
      hora_inicio: horaInicioFinal,
      hora_fin: horaFinFinal,
      cupos_disponibles: cuposFinales
    });

    return successResponse(res, 200, 'Programación actualizada exitosamente', actualizada);
  } catch (error) {
    return next(error);
  }
}

export async function eliminarProgramacionController(req, res, next) {
  const idProgramacion = Number(req.params.id);
  if (isNaN(idProgramacion) || idProgramacion <= 0) {
    return errorResponse(res, 400, 'El ID de programación no es válido', 'INVALID_ID');
  }

  try {
    const existente = await buscarProgramacionPorId(idProgramacion);
    if (!existente) {
      return errorResponse(res, 404, 'Programación no encontrada', 'PROGRAMACION_NOT_FOUND');
    }

    const { confirmadas } = await contarReservasDeProgramacion(idProgramacion);
    if (confirmadas > 0) {
      return errorResponse(
        res,
        409,
        `No se puede eliminar la programación porque tiene ${confirmadas} reserva(s) confirmada(s)`,
        'PROGRAMACION_HAS_RESERVATIONS'
      );
    }

    await eliminarProgramacion(idProgramacion);
    return successResponse(res, 200, 'Programación eliminada exitosamente', { id_programacion: idProgramacion });
  } catch (error) {
    return next(error);
  }
}

export async function obtenerReservasDeProgramacionController(req, res, next) {
  const idProgramacion = Number(req.params.id);
  if (isNaN(idProgramacion) || idProgramacion <= 0) {
    return errorResponse(res, 400, 'El ID de programación no es válido', 'INVALID_ID');
  }

  try {
    const programacion = await buscarProgramacionPorId(idProgramacion);
    if (!programacion) {
      return errorResponse(res, 404, 'Programación no encontrada', 'PROGRAMACION_NOT_FOUND');
    }

    const reservas = await listarReservasPorProgramacion(idProgramacion);
    return successResponse(res, 200, 'Reservas de la programación obtenidas correctamente', {
      programacion,
      reservas
    });
  } catch (error) {
    return next(error);
  }
}
