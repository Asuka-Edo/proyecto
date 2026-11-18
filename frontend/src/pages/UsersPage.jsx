import { useEffect, useState } from 'react';
import {
  actualizarEstadoUsuario,
  actualizarUsuario,
  crearUsuario,
  desbloquearUsuario,
  obtenerUsuarios
} from '../services/usuario.service.js';
import { ModalCrearUsuario } from '../components/usuario/ModalCrearUsuario.jsx';
import { ModalEditarUsuario } from '../components/usuario/ModalEditarUsuario.jsx';
import { ModalConfirmacion } from '../components/membresia/ModalConfirmacion.jsx';

export function UsersPage() {
  const usuarioGuardado = localStorage.getItem('usuario');
  const usuarioSesion = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const esAdministrador = usuarioSesion?.nombre_rol === 'Administrador';

  const [searchTerm, setSearchTerm] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);
  const [usuarioADesbloquear, setUsuarioADesbloquear] = useState(null);
  const [desbloqueando, setDesbloqueando] = useState(false);

  async function cargarUsuarios(busqueda = searchTerm) {
    setCargando(true);
    setError('');

    try {
      const respuesta = await obtenerUsuarios(busqueda);
      setUsuarios(respuesta.data || []);
    } catch (respuestaError) {
      setError(respuestaError?.message || 'No se pudieron cargar los usuarios.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    document.title = esAdministrador ? 'Usuarios | Gimnasio' : 'Clientes | Gimnasio';

    const temporizador = window.setTimeout(() => {
      cargarUsuarios(searchTerm);
    }, 300);

    return () => window.clearTimeout(temporizador);
    // La búsqueda se consulta con una pequeña demora para evitar una petición por cada tecla.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  async function crearNuevoUsuario(datos) {
    await crearUsuario(datos);
    await cargarUsuarios(searchTerm);
  }

  async function guardarEdicionUsuario(datos) {
    if (!usuarioAEditar) return;
    await actualizarUsuario(usuarioAEditar.id_usuario, datos);
    await cargarUsuarios(searchTerm);
  }

  async function cambiarEstado(usuario) {
    const nuevoEstado = usuario.estado === 'Activo' ? 'Inactivo' : 'Activo';

    try {
      await actualizarEstadoUsuario(usuario.id_usuario, nuevoEstado);
      setUsuarios((prev) => prev.map((actual) => (
        actual.id_usuario === usuario.id_usuario
          ? { ...actual, estado: nuevoEstado }
          : actual
      )));
    } catch (respuestaError) {
      setError(respuestaError?.message || 'No se pudo actualizar el estado.');
    }
  }

  async function confirmarDesbloqueo() {
    if (!usuarioADesbloquear) return;

    setDesbloqueando(true);
    try {
      await desbloquearUsuario(usuarioADesbloquear.id_usuario);
      setUsuarios((prev) => prev.map((actual) => (
        actual.id_usuario === usuarioADesbloquear.id_usuario
          ? { ...actual, bloqueado: false }
          : actual
      )));
      setUsuarioADesbloquear(null);
    } catch (respuestaError) {
      setError(respuestaError?.message || 'No se pudo desbloquear el usuario.');
    } finally {
      setDesbloqueando(false);
    }
  }

  const titulo = esAdministrador ? 'Control de Usuarios' : 'Búsqueda de Clientes';
  const descripcion = esAdministrador
    ? 'Busca usuarios por nombre, correo, documento, teléfono o rol; administra su estado o crea nuevos perfiles.'
    : 'Busca clientes por nombre, correo, documento o código de miembro para consultar su información.';

  return (
    <>
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{titulo}</h1>
              <p className="mt-1 text-sm text-slate-600">{descripcion}</p>
            </div>

            {esAdministrador && (
              <button
                type="button"
                onClick={() => setModalCrearAbierto(true)}
                className="cursor-pointer rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500"
              >
                + Crear Usuario
              </button>
            )}
          </div>

          {cargando ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Cargando {esAdministrador ? 'usuarios' : 'clientes'}...
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700">
              <p className="font-semibold">Error al cargar {esAdministrador ? 'usuarios' : 'clientes'}</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:flex-row sm:items-center sm:justify-between">
                <div className="relative w-full sm:max-w-xl">
                  <label htmlFor="busqueda-usuarios" className="sr-only">
                    Buscar {esAdministrador ? 'usuarios' : 'clientes'}
                  </label>
                  <input
                    id="busqueda-usuarios"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={esAdministrador
                      ? 'Buscar por nombre, correo, documento, teléfono o rol...'
                      : 'Buscar por nombre, correo, documento o código de miembro...'}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {usuarios.length} resultado{usuarios.length === 1 ? '' : 's'}
                </span>
              </div>

              {usuarios.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  {searchTerm.trim()
                    ? `No hay ${esAdministrador ? 'usuarios' : 'clientes'} que coincidan con la búsqueda.`
                    : `No hay ${esAdministrador ? 'usuarios registrados' : 'clientes registrados'}.`}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                      <tr>
                        <th className="px-4 py-3">Nombre</th>
                        <th className="px-4 py-3">Documento</th>
                        <th className="px-4 py-3">Correo</th>
                        {esAdministrador && <th className="px-4 py-3">Rol</th>}
                        <th className="px-4 py-3">Estado</th>
                        {esAdministrador && <th className="px-4 py-3">Bloqueado</th>}
                        {esAdministrador && <th className="px-4 py-3 text-center">Acción</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id_usuario} className="border-t border-slate-200 hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-800">
                            {usuario.nombre} {usuario.apellido || ''}
                          </td>
                          <td className="px-4 py-3 text-slate-600">{usuario.documento_identidad || '—'}</td>
                          <td className="px-4 py-3 text-slate-600">{usuario.correo}</td>
                          {esAdministrador && (
                            <td className="px-4 py-3">
                              <span className="rounded-full bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-700">
                                {usuario.nombre_rol}
                              </span>
                            </td>
                          )}
                          <td className="px-4 py-3">
                            <span
                              className={usuario.estado === 'Activo'
                                ? 'rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700'
                                : 'rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700'}
                            >
                              {usuario.estado}
                            </span>
                          </td>
                          {esAdministrador && (
                            <td className="px-4 py-3">
                              {usuario.bloqueado ? (
                                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
                                  Bloqueado
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                          )}
                          {esAdministrador && (
                            <td className="px-4 py-3 text-center">
                              <div className="flex flex-wrap items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setUsuarioAEditar(usuario)}
                                  className="cursor-pointer rounded-lg bg-slate-100 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                                  title="Editar datos del usuario"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => cambiarEstado(usuario)}
                                  className={usuario.estado === 'Activo'
                                    ? 'cursor-pointer rounded-lg bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-700'
                                    : 'cursor-pointer rounded-lg bg-emerald-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-emerald-700'}
                                >
                                  {usuario.estado === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                                {usuario.bloqueado && (
                                  <button
                                    type="button"
                                    onClick={() => setUsuarioADesbloquear(usuario)}
                                    className="cursor-pointer rounded-lg bg-amber-600 px-2.5 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
                                  >
                                    Desbloquear
                                  </button>
                                )}
                              </div>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {esAdministrador && (
        <>
          <ModalCrearUsuario
            abierto={modalCrearAbierto}
            alCerrar={() => setModalCrearAbierto(false)}
            alGuardar={crearNuevoUsuario}
          />

          <ModalEditarUsuario
            abierto={Boolean(usuarioAEditar)}
            alCerrar={() => setUsuarioAEditar(null)}
            alGuardar={guardarEdicionUsuario}
            usuario={usuarioAEditar}
          />

          <ModalConfirmacion
            abierto={Boolean(usuarioADesbloquear)}
            alCerrar={() => setUsuarioADesbloquear(null)}
            alConfirmar={confirmarDesbloqueo}
            titulo="Desbloquear usuario"
            mensaje={`¿Estás seguro de que deseas desbloquear a "${usuarioADesbloquear?.nombre}"? Podrá volver a iniciar sesión de inmediato.`}
            cargando={desbloqueando}
            textoConfirmar="Sí, desbloquear"
            textoCargando="Desbloqueando..."
          />
        </>
      )}
    </>
  );
}
