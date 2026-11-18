import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import request from 'supertest';
import { app } from '../src/app.js';
import { pool } from '../src/config/database.js';
import { crearToken } from '../src/utils/jwt.js';

const tokenAdmin = crearToken({
  id_usuario: 1,
  id_rol: 1,
  nombre_rol: 'Administrador',
  correo: 'admin@test.com'
});

test('Validación unicidad: rechaza registrar usuario con correo ya existente', async () => {
  const respuesta = await request(app)
    .post('/api/usuarios')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nombre: 'Prueba',
      apellido: 'Unicidad',
      documento_identidad: '9998887771',
      correo: 'admin@gimnasio.com', // Correo del admin existente
      contrasena: 'password123',
      nombre_rol: 'Cliente'
    });

  assert.equal(respuesta.status, 409);
  assert.equal(respuesta.body.success, false);
  assert.equal(respuesta.body.error.code, 'EMAIL_ALREADY_EXISTS');
});

test('Ejercicios: rechaza registrar dos veces el mismo nombre de ejercicio', async () => {
  // Crear un ejercicio primero
  const nombreUnico = `Ejercicio Test ${Date.now()}`;
  const res1 = await request(app)
    .post('/api/ejercicios')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nombre_ejercicio: nombreUnico,
      grupo_muscular: 'Piernas',
      descripcion: 'Prueba de unicidad'
    });
  assert.equal(res1.status, 201);

  // Intentar crear de nuevo con el mismo nombre
  const res2 = await request(app)
    .post('/api/ejercicios')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nombre_ejercicio: nombreUnico.toLowerCase(), // case-insensitive
      grupo_muscular: 'Espalda'
    });
  assert.equal(res2.status, 409);
  assert.equal(res2.body.error.code, 'EJERCICIO_ALREADY_EXISTS');

  // Limpiar
  await pool.execute('DELETE FROM ejercicio WHERE nombre_ejercicio = ?', [nombreUnico]);
});

test('Clases: rechaza registrar dos veces el mismo nombre de clase', async () => {
  const nombreClase = `Clase Test ${Date.now()}`;
  const res1 = await request(app)
    .post('/api/clases')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nombre_clase: nombreClase,
      capacidad_maxima: 15
    });
  assert.equal(res1.status, 201);

  const res2 = await request(app)
    .post('/api/clases')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      nombre_clase: nombreClase.toLowerCase(),
      capacidad_maxima: 20
    });
  assert.equal(res2.status, 409);
  assert.equal(res2.body.error.code, 'CLASE_ALREADY_EXISTS');

  // Limpiar
  await pool.execute('DELETE FROM clase WHERE nombre_clase = ?', [nombreClase]);
});

test('Rutinas: rechaza agregar el mismo ejercicio dos veces en el mismo día', async () => {
  const [rutinas] = await pool.execute('SELECT id_rutina FROM rutina LIMIT 1');
  const [ejercicios] = await pool.execute('SELECT id_ejercicio FROM ejercicio LIMIT 1');

  if (rutinas.length === 0 || ejercicios.length === 0) return;

  const idRutina = rutinas[0].id_rutina;
  const idEjercicio = ejercicios[0].id_ejercicio;

  // Insertar un detalle
  const res1 = await request(app)
    .post(`/api/rutinas/${idRutina}/detalles`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      fk_ejercicio: idEjercicio,
      dia_semana: 'Lunes',
      series: 4,
      repeticiones: 10
    });

  if (res1.status === 201) {
    const idDetalleCreado = res1.body.data.id_detalle;

    // Intentar agregarlo de nuevo al mismo día
    const res2 = await request(app)
      .post(`/api/rutinas/${idRutina}/detalles`)
      .set('Authorization', `Bearer ${tokenAdmin}`)
      .send({
        fk_ejercicio: idEjercicio,
        dia_semana: 'Lunes',
        series: 3,
        repeticiones: 12
      });

    assert.equal(res2.status, 409);
    assert.equal(res2.body.error.code, 'EXERCISE_ALREADY_IN_ROUTINE_DAY');

    // Limpiar el detalle de prueba
    await pool.execute('DELETE FROM detalle_rutina WHERE id_detalle = ?', [idDetalleCreado]);
  }
});

after(async () => {
  await pool.end();
});
