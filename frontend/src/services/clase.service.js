import { apiRequest } from './api.js';

function headersAutenticados() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json'
  };
}

export function parsearErrorBackend(err) {
  if (!err) return 'Ocurrió un error inesperado.';

  const codigo = err.codigo || err.code;
  const mensajeBackend = err.mensaje || err.message;

  switch (codigo) {
    case 'MEMBERSHIP_REQUIRED':
      return 'Se requiere una membresía activa para poder reservar una clase.';
    case 'NO_SPOTS_AVAILABLE':
      return 'No hay cupos disponibles para esta clase.';
    case 'ALREADY_RESERVED':
      return 'Ya tienes una reserva confirmada para esta clase.';
    case 'CLIENT_PROFILE_NOT_FOUND':
      return 'No se encontró tu perfil de cliente registrado en el sistema.';
    case 'ENTRENADOR_PROFILE_NOT_FOUND':
      return 'El usuario seleccionado no tiene un perfil de entrenador asociado.';
    case 'CLASE_ALREADY_EXISTS':
      return mensajeBackend || 'Ya existe una clase con ese nombre.';
    case 'CLASS_IN_USE':
      return mensajeBackend || 'La clase está en uso y no puede eliminarse.';
    case 'TRAINER_SCHEDULE_CONFLICT':
      return mensajeBackend || 'El entrenador ya tiene asignada una clase en ese horario.';
    case 'PROGRAMACION_HAS_RESERVATIONS':
      return mensajeBackend || 'La programación tiene reservas confirmadas y no puede eliminarse.';
    default:
      return mensajeBackend || 'Error al procesar la solicitud.';
  }
}

export function obtenerClases() {
  return apiRequest('/clases', {
    headers: headersAutenticados()
  });
}

export function crearClase(datos) {
  return apiRequest('/clases', {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function actualizarClase(idClase, datos) {
  return apiRequest(`/clases/${idClase}`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function eliminarClase(idClase) {
  return apiRequest(`/clases/${idClase}`, {
    method: 'DELETE',
    headers: headersAutenticados()
  });
}

export function obtenerProgramaciones(futuras = false) {
  const queryParam = futuras ? '?futuras=true' : '';
  return apiRequest(`/programaciones${queryParam}`, {
    headers: headersAutenticados()
  });
}

export function crearProgramacion(datos) {
  return apiRequest('/programaciones', {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function actualizarProgramacion(idProgramacion, datos) {
  return apiRequest(`/programaciones/${idProgramacion}`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function eliminarProgramacion(idProgramacion) {
  return apiRequest(`/programaciones/${idProgramacion}`, {
    method: 'DELETE',
    headers: headersAutenticados()
  });
}

export function obtenerReservasDeProgramacion(idProgramacion) {
  return apiRequest(`/programaciones/${idProgramacion}/reservas`, {
    headers: headersAutenticados()
  });
}

export function crearReserva(fk_programacion) {
  return apiRequest('/reservas', {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify({ fk_programacion })
  });
}

export function obtenerMisReservas() {
  return apiRequest('/reservas/mis-reservas', {
    headers: headersAutenticados()
  });
}

export function cancelarReserva(idReserva) {
  return apiRequest(`/reservas/${idReserva}/cancelar`, {
    method: 'PATCH',
    headers: headersAutenticados()
  });
}

export function marcarAsistio(idReserva) {
  return apiRequest(`/reservas/${idReserva}/asistio`, {
    method: 'PATCH',
    headers: headersAutenticados()
  });
}
