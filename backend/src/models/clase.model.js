import { pool } from '../config/database.js';

export async function listarClases() {
  const [filas] = await pool.execute(
    `SELECT id_clase, nombre_clase, descripcion, capacidad_maxima
     FROM clase
     ORDER BY nombre_clase ASC`
  );
  return filas;
}

export async function buscarClasePorId(idClase) {
  const [filas] = await pool.execute(
    `SELECT id_clase, nombre_clase, descripcion, capacidad_maxima
     FROM clase
     WHERE id_clase = ?
     LIMIT 1`,
    [idClase]
  );
  return filas[0] || null;
}

export async function buscarClasePorNombre(nombre_clase, excludeId = null) {
  const [filas] = await pool.execute(
    `SELECT id_clase, nombre_clase, descripcion, capacidad_maxima
     FROM clase
     WHERE LOWER(TRIM(nombre_clase)) = LOWER(TRIM(?))
       ${excludeId ? 'AND id_clase != ?' : ''}
     LIMIT 1`,
    excludeId ? [nombre_clase, excludeId] : [nombre_clase]
  );
  return filas[0] || null;
}

export async function crearClase({ nombre_clase, descripcion = null, capacidad_maxima }) {
  const [resultado] = await pool.execute(
    `INSERT INTO clase (nombre_clase, descripcion, capacidad_maxima)
     VALUES (?, ?, ?)`,
    [nombre_clase, descripcion, capacidad_maxima]
  );
  return buscarClasePorId(resultado.insertId);
}

export async function actualizarClase(idClase, { nombre_clase, descripcion, capacidad_maxima }) {
  const campos = [];
  const valores = [];

  if (nombre_clase !== undefined) {
    campos.push('nombre_clase = ?');
    valores.push(nombre_clase);
  }
  if (descripcion !== undefined) {
    campos.push('descripcion = ?');
    valores.push(descripcion);
  }
  if (capacidad_maxima !== undefined) {
    campos.push('capacidad_maxima = ?');
    valores.push(capacidad_maxima);
  }

  if (campos.length > 0) {
    valores.push(idClase);
    await pool.execute(
      `UPDATE clase SET ${campos.join(', ')} WHERE id_clase = ?`,
      valores
    );
  }

  return buscarClasePorId(idClase);
}

export async function contarProgramacionesDeClase(idClase) {
  const [filas] = await pool.execute(
    'SELECT COUNT(*) as total FROM programacion_clase WHERE fk_clase = ?',
    [idClase]
  );
  return filas[0]?.total || 0;
}

export async function eliminarClase(idClase) {
  const [resultado] = await pool.execute(
    'DELETE FROM clase WHERE id_clase = ?',
    [idClase]
  );
  return resultado.affectedRows;
}
