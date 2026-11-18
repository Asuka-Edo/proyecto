import { pool } from '../config/database.js';

const SELECT_PROGRAMACION = `
  SELECT 
    pc.id_programacion,
    pc.fecha,
    pc.hora_inicio,
    pc.hora_fin,
    pc.cupos_disponibles,
    pc.fk_clase,
    cl.nombre_clase,
    cl.descripcion AS descripcion_clase,
    cl.capacidad_maxima,
    pc.fk_entrenador,
    e.fk_usuario AS id_usuario_entrenador,
    CONCAT(u.nombre, ' ', u.apellido) AS nombre_entrenador,
    u.correo AS correo_entrenador
  FROM programacion_clase pc
  INNER JOIN clase cl ON cl.id_clase = pc.fk_clase
  INNER JOIN entrenador e ON e.id_entrenador = pc.fk_entrenador
  INNER JOIN usuario u ON u.id_usuario = e.fk_usuario
`;

export async function buscarProgramacionPorId(idProgramacion) {
  const [filas] = await pool.execute(
    `${SELECT_PROGRAMACION}
     WHERE pc.id_programacion = ?
     LIMIT 1`,
    [idProgramacion]
  );
  return filas[0] || null;
}

export async function listarProgramaciones() {
  const [filas] = await pool.execute(
    `${SELECT_PROGRAMACION}
     ORDER BY pc.fecha DESC, pc.hora_inicio ASC`
  );
  return filas;
}

export async function listarProgramacionesFuturas() {
  const [filas] = await pool.execute(
    `${SELECT_PROGRAMACION}
     WHERE pc.fecha >= CURDATE()
     ORDER BY pc.fecha ASC, pc.hora_inicio ASC`
  );
  return filas;
}

export async function verificarSolapamientoEntrenador({
  fk_entrenador,
  fecha,
  hora_inicio,
  hora_fin,
  excludeId = null
}) {
  const [filas] = await pool.execute(
    `SELECT pc.id_programacion, cl.nombre_clase, pc.hora_inicio, pc.hora_fin
     FROM programacion_clase pc
     INNER JOIN clase cl ON cl.id_clase = pc.fk_clase
     WHERE pc.fk_entrenador = ?
       AND pc.fecha = ?
       AND NOT (pc.hora_fin <= ? OR pc.hora_inicio >= ?)
       ${excludeId ? 'AND pc.id_programacion != ?' : ''}
     LIMIT 1`,
    excludeId
      ? [fk_entrenador, fecha, hora_inicio, hora_fin, excludeId]
      : [fk_entrenador, fecha, hora_inicio, hora_fin]
  );
  return filas[0] || null;
}

export async function crearProgramacion({
  fk_clase,
  fk_entrenador,
  fecha,
  hora_inicio,
  hora_fin,
  cupos_disponibles
}) {
  const [resultado] = await pool.execute(
    `INSERT INTO programacion_clase (fk_clase, fk_entrenador, fecha, hora_inicio, hora_fin, cupos_disponibles)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [fk_clase, fk_entrenador, fecha, hora_inicio, hora_fin, cupos_disponibles]
  );
  return buscarProgramacionPorId(resultado.insertId);
}

export async function actualizarProgramacion(idProgramacion, datos) {
  const campos = [];
  const valores = [];

  if (datos.fk_clase !== undefined) {
    campos.push('fk_clase = ?');
    valores.push(datos.fk_clase);
  }
  if (datos.fk_entrenador !== undefined) {
    campos.push('fk_entrenador = ?');
    valores.push(datos.fk_entrenador);
  }
  if (datos.fecha !== undefined) {
    campos.push('fecha = ?');
    valores.push(datos.fecha);
  }
  if (datos.hora_inicio !== undefined) {
    campos.push('hora_inicio = ?');
    valores.push(datos.hora_inicio);
  }
  if (datos.hora_fin !== undefined) {
    campos.push('hora_fin = ?');
    valores.push(datos.hora_fin);
  }
  if (datos.cupos_disponibles !== undefined) {
    campos.push('cupos_disponibles = ?');
    valores.push(datos.cupos_disponibles);
  }

  if (campos.length > 0) {
    valores.push(idProgramacion);
    await pool.execute(
      `UPDATE programacion_clase SET ${campos.join(', ')} WHERE id_programacion = ?`,
      valores
    );
  }

  return buscarProgramacionPorId(idProgramacion);
}

export async function contarReservasDeProgramacion(idProgramacion) {
  const [filas] = await pool.execute(
    `SELECT 
       COUNT(*) as total,
       SUM(CASE WHEN estado_reserva = 'Confirmada' THEN 1 ELSE 0 END) as confirmadas
     FROM reserva_clase 
     WHERE fk_programacion = ?`,
    [idProgramacion]
  );
  return {
    total: filas[0]?.total || 0,
    confirmadas: Number(filas[0]?.confirmadas || 0)
  };
}

export async function eliminarProgramacion(idProgramacion) {
  const [resultado] = await pool.execute(
    'DELETE FROM programacion_clase WHERE id_programacion = ?',
    [idProgramacion]
  );
  return resultado.affectedRows;
}
