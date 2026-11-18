import { pool } from '../config/database.js';

export async function listarEjercicios() {
  const [filas] = await pool.execute(
    `SELECT id_ejercicio, nombre_ejercicio, grupo_muscular, descripcion
     FROM ejercicio
     ORDER BY grupo_muscular ASC, nombre_ejercicio ASC`
  );
  return filas;
}

export async function buscarEjercicioPorId(idEjercicio) {
  const [filas] = await pool.execute(
    `SELECT id_ejercicio, nombre_ejercicio, grupo_muscular, descripcion
     FROM ejercicio
     WHERE id_ejercicio = ?
     LIMIT 1`,
    [idEjercicio]
  );
  return filas[0] || null;
}

export async function buscarEjercicioPorNombre(nombre_ejercicio, excludeId = null) {
  const [filas] = await pool.execute(
    `SELECT id_ejercicio, nombre_ejercicio, grupo_muscular, descripcion
     FROM ejercicio
     WHERE LOWER(TRIM(nombre_ejercicio)) = LOWER(TRIM(?))
       ${excludeId ? 'AND id_ejercicio != ?' : ''}
     LIMIT 1`,
    excludeId ? [nombre_ejercicio, excludeId] : [nombre_ejercicio]
  );
  return filas[0] || null;
}

export async function crearEjercicio({ nombre_ejercicio, grupo_muscular, descripcion = null }) {
  const [resultado] = await pool.execute(
    `INSERT INTO ejercicio (nombre_ejercicio, grupo_muscular, descripcion)
     VALUES (?, ?, ?)`,
    [nombre_ejercicio, grupo_muscular, descripcion]
  );

  return buscarEjercicioPorId(resultado.insertId);
}

export async function actualizarEjercicio(idEjercicio, { nombre_ejercicio, grupo_muscular, descripcion }) {
  const campos = [];
  const valores = [];

  if (nombre_ejercicio !== undefined) {
    campos.push('nombre_ejercicio = ?');
    valores.push(nombre_ejercicio);
  }
  if (grupo_muscular !== undefined) {
    campos.push('grupo_muscular = ?');
    valores.push(grupo_muscular);
  }
  if (descripcion !== undefined) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }

  if (campos.length > 0) {
    valores.push(idEjercicio);
    await pool.execute(
      `UPDATE ejercicio SET ${campos.join(', ')} WHERE id_ejercicio = ?`,
      valores
    );
  }

  return buscarEjercicioPorId(idEjercicio);
}

export async function contarUsosEnRutinas(idEjercicio) {
  const [filas] = await pool.execute(
    'SELECT COUNT(*) as total FROM detalle_rutina WHERE fk_ejercicio = ?',
    [idEjercicio]
  );
  return filas[0]?.total || 0;
}

export async function eliminarEjercicio(idEjercicio) {
  const [resultado] = await pool.execute(
    'DELETE FROM ejercicio WHERE id_ejercicio = ?',
    [idEjercicio]
  );
  return resultado.affectedRows;
}
