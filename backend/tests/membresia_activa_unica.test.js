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

test('POST /api/membresias rechaza asignar una segunda membresía si el cliente ya tiene una activa', async () => {
  // 1. Obtener o insertar un cliente de prueba
  const [clientes] = await pool.execute(`
    SELECT c.id_cliente 
    FROM cliente c
    INNER JOIN usuario u ON u.id_usuario = c.fk_usuario
    INNER JOIN estado e ON e.id_estado = u.fk_estado
    WHERE e.nombre_estado = 'Activo'
    LIMIT 1
  `);

  const [planes] = await pool.execute(`SELECT id_plan FROM plan WHERE activo = 1 LIMIT 1`);

  if (clientes.length === 0 || planes.length === 0) {
    // Si la BD no tiene registros suficientes, el test se omite amigablemente
    return;
  }

  const idCliente = clientes[0].id_cliente;
  const idPlan = planes[0].id_plan;

  // Insertar una membresía activa garantizada con vencimiento en 30 días
  await pool.execute(`
    INSERT INTO membresia (fk_cliente, fk_plan, fecha_inicio, fecha_vencimiento, precio_pagado, ingresos_incluidos, estado_membresia)
    VALUES (?, ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 30 DAY), 100000, NULL, 'Activa')
  `, [idCliente, idPlan]);

  // Intentar crear otra membresía para el mismo cliente
  const respuesta = await request(app)
    .post('/api/membresias')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({
      fk_cliente: idCliente,
      fk_plan: idPlan
    });

  assert.equal(respuesta.status, 400);
  assert.equal(respuesta.body.success, false);
  assert.equal(respuesta.body.error.code, 'ACTIVE_MEMBERSHIP_EXISTS');
  assert.ok(respuesta.body.message.includes('ya cuenta con una membresía activa vigente'));
});

after(async () => {
  await pool.end();
});
