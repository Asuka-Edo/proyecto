import { pool } from '../config/database.js';

export async function listarUsuarios({ busqueda = '', soloClientes = false } = {}) {
	const condiciones = [];
	const parametros = [];
	const termino = String(busqueda).trim();

	if (soloClientes) {
		condiciones.push("r.nombre_rol = 'Cliente'");
	}

	if (termino) {
		const patron = `%${termino}%`;
		condiciones.push(`(
			u.nombre LIKE ?
			OR u.apellido LIKE ?
			OR CONCAT_WS(' ', u.nombre, u.apellido) LIKE ?
			OR u.documento_identidad LIKE ?
			OR u.correo LIKE ?
			OR u.telefono LIKE ?
			OR r.nombre_rol LIKE ?
			OR c.codigo_miembro LIKE ?
		)`);
		parametros.push(patron, patron, patron, patron, patron, patron, patron, patron);
	}

	const where = condiciones.length > 0 ? `WHERE ${condiciones.join(' AND ')}` : '';
	const [filas] = await pool.execute(
		`SELECT u.id_usuario, u.nombre, u.apellido, u.documento_identidad, u.correo, u.telefono,
						r.id_rol, r.nombre_rol,
						e.id_estado, e.nombre_estado AS estado,
						(u.bloqueado_hasta IS NOT NULL AND u.bloqueado_hasta > NOW()) AS bloqueado
				 FROM usuario u
				 INNER JOIN rol r ON r.id_rol = u.fk_rol
				 INNER JOIN estado e ON e.id_estado = u.fk_estado
			LEFT JOIN cliente c ON c.fk_usuario = u.id_usuario
				${where}
				ORDER BY u.id_usuario ASC`,
		parametros
	);

	return filas.map((fila) => ({ ...fila, bloqueado: Boolean(fila.bloqueado) }));
}

export async function buscarUsuarioPorId(idUsuario) {
	const [filas] = await pool.execute(
		`SELECT u.id_usuario, u.nombre, u.apellido, u.documento_identidad, u.correo, u.telefono,
						r.id_rol, r.nombre_rol,
						e.id_estado, e.nombre_estado AS estado,
						(u.bloqueado_hasta IS NOT NULL AND u.bloqueado_hasta > NOW()) AS bloqueado,
						c.id_cliente, c.codigo_miembro,
						ent.id_entrenador,
						adm.id_administrador
				 FROM usuario u
				 INNER JOIN rol r ON r.id_rol = u.fk_rol
				 INNER JOIN estado e ON e.id_estado = u.fk_estado
				 LEFT JOIN cliente c ON c.fk_usuario = u.id_usuario
				 LEFT JOIN entrenador ent ON ent.fk_usuario = u.id_usuario
				 LEFT JOIN administrador adm ON adm.fk_usuario = u.id_usuario
				WHERE u.id_usuario = ?
				LIMIT 1`,
		[idUsuario]
	);

	if (!filas[0]) return null;
	return { ...filas[0], bloqueado: Boolean(filas[0].bloqueado) };
}

export async function actualizarUsuario(idUsuario, datos) {
	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		const [usuarioExistente] = await connection.execute(
			'SELECT id_usuario FROM usuario WHERE id_usuario = ? LIMIT 1',
			[idUsuario]
		);
		if (!usuarioExistente[0]) {
			await connection.rollback();
			return null;
		}

		if (datos.correo) {
			const [filasCorreo] = await connection.execute(
				'SELECT id_usuario FROM usuario WHERE correo = ? AND id_usuario != ? LIMIT 1',
				[datos.correo, idUsuario]
			);
			if (filasCorreo.length > 0) {
				const err = new Error('El correo electrónico ya está registrado por otro usuario');
				err.code = 'EMAIL_ALREADY_EXISTS';
				throw err;
			}
		}

		if (datos.documento_identidad) {
			const [filasDoc] = await connection.execute(
				'SELECT id_usuario FROM usuario WHERE documento_identidad = ? AND id_usuario != ? LIMIT 1',
				[datos.documento_identidad, idUsuario]
			);
			if (filasDoc.length > 0) {
				const err = new Error('El documento de identidad ya está registrado por otro usuario');
				err.code = 'DOCUMENT_ALREADY_EXISTS';
				throw err;
			}
		}

		const campos = [];
		const valores = [];

		if (datos.nombre !== undefined) {
			campos.push('nombre = ?');
			valores.push(datos.nombre);
		}
		if (datos.apellido !== undefined) {
			campos.push('apellido = ?');
			valores.push(datos.apellido);
		}
		if (datos.documento_identidad !== undefined) {
			campos.push('documento_identidad = ?');
			valores.push(datos.documento_identidad);
		}
		if (datos.correo !== undefined) {
			campos.push('correo = ?');
			valores.push(datos.correo);
		}
		if (datos.telefono !== undefined) {
			campos.push('telefono = ?');
			valores.push(datos.telefono || null);
		}

		if (campos.length > 0) {
			valores.push(idUsuario);
			await connection.execute(
				`UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`,
				valores
			);
		}

		if (datos.codigo_miembro !== undefined) {
			await connection.execute(
				'UPDATE cliente SET codigo_miembro = ? WHERE fk_usuario = ?',
				[datos.codigo_miembro, idUsuario]
			);
		}

		await connection.commit();
		return await buscarUsuarioPorId(idUsuario);
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}

export async function cambiarEstadoUsuario(idUsuario, estado) {
	const [estadoFila] = await pool.execute(
		'SELECT id_estado FROM estado WHERE nombre_estado = ? LIMIT 1',
		[estado]
	);

	if (!estadoFila[0]) {
		return 0;
	}

	const [resultado] = await pool.execute(
		'UPDATE usuario SET fk_estado = ? WHERE id_usuario = ?',
		[estadoFila[0].id_estado, idUsuario]
	);

	return resultado.affectedRows;
}

export async function desbloquearUsuario(idUsuario) {
	const [resultado] = await pool.execute(
		'UPDATE usuario SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id_usuario = ?',
		[idUsuario]
	);

	return resultado.affectedRows;
}
