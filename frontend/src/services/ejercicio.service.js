import { apiRequest } from './api.js';

function headersAutenticados() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    'Content-Type': 'application/json'
  };
}

export function obtenerEjercicios() {
  return apiRequest('/ejercicios', {
    headers: headersAutenticados()
  });
}

export function obtenerEjercicioPorId(idEjercicio) {
  return apiRequest(`/ejercicios/${idEjercicio}`, {
    headers: headersAutenticados()
  });
}

export function crearEjercicio(datos) {
  return apiRequest('/ejercicios', {
    method: 'POST',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function actualizarEjercicio(idEjercicio, datos) {
  return apiRequest(`/ejercicios/${idEjercicio}`, {
    method: 'PUT',
    headers: headersAutenticados(),
    body: JSON.stringify(datos)
  });
}

export function eliminarEjercicio(idEjercicio) {
  return apiRequest(`/ejercicios/${idEjercicio}`, {
    method: 'DELETE',
    headers: headersAutenticados()
  });
}
