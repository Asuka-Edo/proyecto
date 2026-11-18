import { useEffect, useState } from 'react';
import { ModalCrearClase } from '../components/clase/ModalCrearClase.jsx';
import { ModalEditarClase } from '../components/clase/ModalEditarClase.jsx';
import { ModalProgramarClase } from '../components/clase/ModalProgramarClase.jsx';
import { ModalVerAsistentes } from '../components/clase/ModalVerAsistentes.jsx';
import { ModalConfirmacion } from '../components/membresia/ModalConfirmacion.jsx';
import {
  cancelarReserva,
  eliminarClase,
  eliminarProgramacion,
  marcarAsistio,
  obtenerClases,
  obtenerProgramaciones,
  parsearErrorBackend
} from '../services/clase.service.js';
import { obtenerEntrenadores } from '../services/entrenador.service.js';

export function ClasesAdminPage() {
  const [clases, setClases] = useState([]);
  const [programaciones, setProgramaciones] = useState([]);
  const [entrenadores, setEntrenadores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [claseAEditar, setClaseAEditar] = useState(null);
  const [claseAEliminar, setClaseAEliminar] = useState(null);
  const [programacionAEliminar, setProgramacionAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [modalProgramarAbierto, setModalProgramarAbierto] = useState(false);
  const [programacionParaAsistentes, setProgramacionParaAsistentes] = useState(null);

  const usuarioGuardado = localStorage.getItem('usuario');
  const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
  const rolUsuario = usuario?.nombre_rol || '';

  useEffect(() => {
    document.title = 'Gestión de Clases | Gimnasio';
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setError('');
    try {
      const [respClases, respProgramaciones] = await Promise.all([
        obtenerClases(),
        obtenerProgramaciones(false)
      ]);

      setClases(respClases?.data || []);
      setProgramaciones(respProgramaciones?.data || []);

      if (rolUsuario === 'Administrador') {
        const respEntrenadores = await obtenerEntrenadores().catch(() => ({ data: [] }));
        setEntrenadores(respEntrenadores?.data || []);
      }
    } catch (err) {
      setError(parsearErrorBackend(err));
    } finally {
      setCargando(false);
    }
  }

  async function handleCancelarReservaAsistente(idReserva) {
    await cancelarReserva(idReserva);
    await cargarDatos();
  }

  async function handleMarcarAsistioAsistente(idReserva) {
    await marcarAsistio(idReserva);
    await cargarDatos();
  }

  async function confirmarEliminarClase() {
    if (!claseAEliminar) return;

    setEliminando(true);
    try {
      await eliminarClase(claseAEliminar.id_clase);
      setClaseAEliminar(null);
      await cargarDatos();
    } catch (err) {
      setError(parsearErrorBackend(err));
    } finally {
      setEliminando(false);
    }
  }

  async function confirmarEliminarProgramacion() {
    if (!programacionAEliminar) return;

    setEliminando(true);
    try {
      await eliminarProgramacion(programacionAEliminar.id_programacion);
      setProgramacionAEliminar(null);
      await cargarDatos();
    } catch (err) {
      setError(parsearErrorBackend(err));
    } finally {
      setEliminando(false);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Encabezado */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Gestión de Clases Grupales
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Administra el catálogo de clases, su programación semanal y revisa la asistencia de los alumnos.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setModalCrearAbierto(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition cursor-pointer"
            >
              <span>➕</span>
              <span>Nueva Clase</span>
            </button>
            <button
              type="button"
              onClick={() => setModalProgramarAbierto(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-sky-500 transition cursor-pointer"
            >
              <span>📅</span>
              <span>Programar Clase</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {error}
          </div>
        )}

            {/* Sección: Programaciones Activas */}
            <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Clases Programadas
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {programaciones.length} sesión{programaciones.length !== 1 ? 'es' : ''}
                </span>
              </div>

              {cargando ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Cargando clases programadas...
                </div>
              ) : programaciones.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No hay sesiones programadas actualmente. Usa el botón "Programar Clase" para agendar una.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-slate-200 text-left text-sm">
                    <thead className="bg-slate-800 text-white">
                      <tr>
                        <th className="px-4 py-3">Clase</th>
                        <th className="px-4 py-3">Entrenador</th>
                        <th className="px-4 py-3">Fecha</th>
                        <th className="px-4 py-3">Horario</th>
                        <th className="px-4 py-3">Cupos Disponibles</th>
                        <th className="px-4 py-3 text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {programaciones.map((p) => (
                        <tr key={p.id_programacion} className="hover:bg-slate-50 transition">
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-800">{p.nombre_clase}</p>
                            {p.descripcion && (
                              <p className="text-xs text-slate-500 max-w-xs truncate">
                                {p.descripcion}
                              </p>
                            )}
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium">
                            {p.nombre_entrenador} {p.apellido_entrenador || ''}
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-semibold">{p.fecha}</td>
                          <td className="px-4 py-3 text-xs font-mono text-slate-600">
                            {p.hora_inicio} - {p.hora_fin}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                                p.cupos_disponibles > 0
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {p.cupos_disponibles} cupo{p.cupos_disponibles !== 1 ? 's' : ''}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                type="button"
                                onClick={() => setProgramacionParaAsistentes(p)}
                                className="rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-bold text-sky-700 border border-sky-200 hover:bg-sky-100 transition cursor-pointer"
                              >
                                👥 Asistentes
                              </button>
                              <button
                                type="button"
                                onClick={() => setProgramacionAEliminar(p)}
                                className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-bold text-red-600 border border-red-200 hover:bg-red-100 transition cursor-pointer"
                                title="Cancelar o eliminar sesión"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Sección: Catálogo de Clases */}
            <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-800">
                  Catálogo de Clases Registradas
                </h2>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {clases.length} tipo{clases.length !== 1 ? 's' : ''} de clase
                </span>
              </div>

              {cargando ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  Cargando catálogo...
                </div>
              ) : clases.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500">
                  No hay clases registradas en el catálogo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clases.map((c) => (
                    <div
                      key={c.id_clase}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4 flex flex-col justify-between hover:shadow-md transition"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-bold text-slate-800 text-base">{c.nombre_clase}</h3>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setClaseAEditar(c)}
                              className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-slate-700 border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
                              title="Editar clase"
                            >
                              ✏️
                            </button>
                            <button
                              type="button"
                              onClick={() => setClaseAEliminar(c)}
                              className="rounded-lg bg-white px-2 py-1 text-xs font-semibold text-red-600 border border-slate-200 hover:bg-red-50 transition cursor-pointer"
                              title="Eliminar clase"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="mt-1 text-xs text-slate-600 line-clamp-3">
                          {c.descripcion || 'Sin descripción especificada.'}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-200/80 pt-3">
                        <span className="text-xs text-slate-500">Capacidad Máxima:</span>
                        <span className="rounded-md bg-white px-2 py-1 text-xs font-bold text-slate-700 border border-slate-200">
                          {c.capacidad_maxima} personas
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        </div>

      <ModalCrearClase
        abierto={modalCrearAbierto}
        alCerrar={() => setModalCrearAbierto(false)}
        alGuardar={cargarDatos}
      />

      <ModalEditarClase
        abierto={Boolean(claseAEditar)}
        alCerrar={() => setClaseAEditar(null)}
        alGuardar={cargarDatos}
        clase={claseAEditar}
      />

      <ModalProgramarClase
        abierto={modalProgramarAbierto}
        alCerrar={() => setModalProgramarAbierto(false)}
        alGuardar={cargarDatos}
        clases={clases}
        entrenadores={entrenadores}
        rolUsuario={rolUsuario}
      />

      <ModalVerAsistentes
        abierto={Boolean(programacionParaAsistentes)}
        alCerrar={() => setProgramacionParaAsistentes(null)}
        programacion={programacionParaAsistentes}
        rolUsuario={rolUsuario}
        alCancelarReserva={handleCancelarReservaAsistente}
        alMarcarAsistio={handleMarcarAsistioAsistente}
      />

      <ModalConfirmacion
        abierto={Boolean(claseAEliminar)}
        alCerrar={() => setClaseAEliminar(null)}
        alConfirmar={confirmarEliminarClase}
        titulo="Eliminar clase del catálogo"
        mensaje={`¿Estás seguro de que deseas eliminar la clase "${claseAEliminar?.nombre_clase}"? No podrá eliminarse si tiene programaciones registradas.`}
        cargando={eliminando}
        textoConfirmar="Sí, eliminar"
        textoCargando="Eliminando..."
      />

      <ModalConfirmacion
        abierto={Boolean(programacionAEliminar)}
        alCerrar={() => setProgramacionAEliminar(null)}
        alConfirmar={confirmarEliminarProgramacion}
        titulo="Eliminar sesión programada"
        mensaje={`¿Estás seguro de que deseas eliminar la sesión programada de "${programacionAEliminar?.nombre_clase}" del ${programacionAEliminar?.fecha}?`}
        cargando={eliminando}
        textoConfirmar="Sí, eliminar"
        textoCargando="Eliminando..."
      />
    </>
  );
}
