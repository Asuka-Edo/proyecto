import { apiRequest } from './api.js';

function headersAutenticados() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json'
  };
}

export function obtenerUsuarios(busqueda = '') {
  const termino = String(busqueda).trim();
  const query = termino ? `?${new URLSearchParams({ busqueda: termino }).toString()}` : '';

  return apiRequest(`/usuarios${query}`, {
    headers: headersAutenticados()
  });
}

export function obtenerUsuarioPorId(idUsuario) {
  return apiRequest(`/usuarios/${idUsuario}`, {
    headers: headersAutenticados()
  });
}

export function crearUsuario(datos) {
  return apiRequest('/usuarios', {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function actualizarUsuario(idUsuario, datos) {
  return apiRequest(`/usuarios/${idUsuario}`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function actualizarEstadoUsuario(idUsuario, estado) {
  return apiRequest(`/usuarios/${idUsuario}/estado`, {
    method: 'PATCH',
    headers: headersAutenticados(),
    body: JSON.stringify({ estado })
  });
}

export function desbloquearUsuario(idUsuario) {
  return apiRequest(`/usuarios/${idUsuario}/desbloquear`, {
    method: 'PATCH',
    headers: headersAutenticados()
  });
}
