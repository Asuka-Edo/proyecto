import { useEffect, useState, useMemo } from 'react';
import { obtenerMisAsistencias } from '../services/asistencia.service.js';
import { cancelarMembresia, obtenerHistorialUsuario } from '../services/membresia.service.js';
import { obtenerPagosPorMembresia } from '../services/pago.service.js';
import { obtenerPlanes } from '../services/plan.service.js';
import { ModalConfirmacion } from '../components/membresia/ModalConfirmacion.jsx';
import { formatearMoneda } from '../utils/moneda.js';

const DIAS_SEMANA = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function obtenerDiasDelMes(mes) {
  if (!mes) return 0;
  const [anio, mesNumero] = mes.split('-').map(Number);
  return new Date(anio, mesNumero, 0).getDate();
}

function obtenerOffsetInicio(mes) {
  if (!mes) return 0;
  const [anio, mesNumero] = mes.split('-').map(Number);
  const diaSemana = new Date(anio, mesNumero - 1, 1).getDay();
  return (diaSemana + 6) % 7; // 0 = Lunes
}

export function MiMembresiaPage() {
  const [tabActiva, setTabActiva] = useState('mi_suscripcion'); // 'mi_suscripcion' | 'planes_disponibles'
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [perfilNoEncontrado, setPerfilNoEncontrado] = useState(false);
  const [pagosActivos, setPagosActivos] = useState([]);
  const [cargandoPagos, setCargandoPagos] = useState(false);
  const [asistencias, setAsistencias] = useState(null);
  const [cargandoAsistencias, setCargandoAsistencias] = useState(false);

  // Helper to check cancellation window (days 1-5 inclusive)
  function isCancellationWindowOpen() {
    const today = new Date();
    const day = today.getDate();
    return day >= 1 && day <= 5;
  }
  
  const [modalCancelarAbierto, setModalCancelarAbierto] = useState(false);
  const [cancelandoMembresia, setCancelandoMembresia] = useState(false);
  const [mensajeExito, setMensajeExito] = useState('');
  const [errorCancelacion, setErrorCancelacion] = useState('');

  // Catálogo de planes disponibles
  const [planesDisponibles, setPlanesDisponibles] = useState([]);
  const [cargandoPlanes, setCargandoPlanes] = useState(false);

  // Parseo seguro del localStorage
  const usuario = useMemo(() => {
    try {
      const usuarioGuardado = localStorage.getItem('usuario');
      return usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    } catch (e) {
      console.error("Error al leer el usuario de localStorage", e);
      return null;
    }
  }, []);

  useEffect(() => {
    document.title = 'Mi Membresía y Planes | Gimnasio';

    if (!usuario?.id_usuario) {
      setError('No se pudo identificar tu sesión.');
      setCargando(false);
      return;
    }

    cargarHistorial(usuario.id_usuario);
    cargarAsistencias();
    cargarCatalogoPlanes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuario?.id_usuario]);

  async function cargarCatalogoPlanes() {
    setCargandoPlanes(true);
    try {
      const resp = await obtenerPlanes(false); // Solo planes activos
      setPlanesDisponibles(resp?.data || []);
    } catch {
      setPlanesDisponibles([]);
    } finally {
      setCargandoPlanes(false);
    }
  }

  async function cargarAsistencias() {
    setCargandoAsistencias(true);
    try {
      const respuesta = await obtenerMisAsistencias();
      setAsistencias(respuesta.data);
    } catch {
      setAsistencias(null);
    } finally {
      setCargandoAsistencias(false);
    }
  }

  async function cargarHistorial(idUsuario) {
    setCargando(true);
    setError('');
    setPerfilNoEncontrado(false);

    try {
      const respuesta = await obtenerHistorialUsuario(idUsuario);
      setDatos(respuesta.data);

      if (respuesta.data?.membresia_activa?.id_membresia) {
        cargarPagosMembresia(respuesta.data.membresia_activa.id_membresia);
      }
    } catch (err) {
      if (err?.error?.code === 'CLIENT_PROFILE_NOT_FOUND') {
        setPerfilNoEncontrado(true);
      } else {
        setError(err?.message || 'No se pudo obtener la información de tu membresía.');
      }
    } finally {
      setCargando(false);
    }
  }

  async function cargarPagosMembresia(idMembresia) {
    setCargandoPagos(true);
    try {
      const respPagos = await obtenerPagosPorMembresia(idMembresia);
      setPagosActivos(respPagos?.data?.pagos || []);
    } catch {
      setPagosActivos([]);
    } finally {
      setCargandoPagos(false);
    }
  }

  async function handleConfirmarCancelacionCliente() {
    if (!datos?.membresia_activa?.id_membresia) return;

    setCancelandoMembresia(true);
    setErrorCancelacion('');
    setMensajeExito('');

    try {
      await cancelarMembresia(datos.membresia_activa.id_membresia);
      setMensajeExito('Tu membresía ha sido cancelada correctamente.');
      setModalCancelarAbierto(false);
      await cargarHistorial(usuario.id_usuario);
    } catch (err) {
      setErrorCancelacion(err?.message || 'Error al procesar la cancelación de la membresía.');
      setModalCancelarAbierto(false);
    } finally {
      setCancelandoMembresia(false);
    }
  }

  const membresiaActiva = datos?.membresia_activa;
  const historial = datos?.historial || [];

  return (
    <>
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
            Mi Membresía y Planes
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Consulta tu suscripción activa, asistencias, o explora los distintos planes y membresías ofrecidos.
          </p>
        </div>

        {mensajeExito && (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 border border-emerald-200">
            {mensajeExito}
          </div>
        )}

        {errorCancelacion && (
          <div className="rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-700 border border-red-200">
            {errorCancelacion}
          </div>
        )}

        {/* Pestañas */}
        <div className="flex border-b border-slate-200 gap-2">
          <button
            type="button"
            onClick={() => setTabActiva('mi_suscripcion')}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 cursor-pointer ${
              tabActiva === 'mi_suscripcion'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Mi Suscripción e Historial
          </button>
          <button
            type="button"
            onClick={() => setTabActiva('planes_disponibles')}
            className={`pb-3 px-4 text-sm font-semibold transition border-b-2 cursor-pointer ${
              tabActiva === 'planes_disponibles'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            ⭐ Planes y Membresías Disponibles
          </button>
        </div>

        {tabActiva === 'planes_disponibles' ? (
          <div className="space-y-6">
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-5">
              <h3 className="font-bold text-sky-900 text-base">Descubre nuestras membresías</h3>
              <p className="text-xs text-sky-700 mt-1">
                Para renovar, cambiar o adquirir cualquiera de estos planes, acércate a la recepción o comunícate con un administrador.
              </p>
            </div>

            {cargandoPlanes ? (
              <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500 shadow-sm">
                Cargando catálogo de planes...
              </div>
            ) : planesDisponibles.length === 0 ? (
              <div className="rounded-2xl bg-white p-12 text-center text-sm text-slate-500 shadow-sm border border-dashed border-slate-300">
                No hay planes disponibles en este momento.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {planesDisponibles.map((plan) => {
                  const esPlanActual = membresiaActiva?.id_plan === plan.id_plan;
                  return (
                    <div
                      key={plan.id_plan}
                      className={`rounded-2xl bg-white p-6 shadow-md border flex flex-col justify-between transition ${
                        esPlanActual ? 'border-sky-500 ring-2 ring-sky-500/20' : 'border-slate-200 hover:border-slate-300 hover:shadow-lg'
                      }`}
                    >
                      <div>
                        {esPlanActual && (
                          <span className="inline-block mb-3 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                            ✓ Tu plan actual
                          </span>
                        )}
                        <h3 className="text-xl font-bold text-slate-800">{plan.nombre_plan}</h3>
                        <p className="text-xs text-slate-500 mt-1 min-h-[36px]">
                          {plan.descripcion || 'Acceso completo a las instalaciones y áreas de entrenamiento.'}
                        </p>

                        <div className="mt-4 flex items-baseline gap-1">
                          <span className="text-3xl font-extrabold text-slate-900">
                            {formatearMoneda(plan.precio)}
                          </span>
                          <span className="text-xs text-slate-500">/ {plan.duracion_dias} días</span>
                        </div>

                        <div className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-600">
                          <div className="flex items-center gap-2">
                            <span className="text-sky-600 font-bold">✓</span>
                            <span>Duración: <strong>{plan.duracion_dias} días de cobertura</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sky-600 font-bold">✓</span>
                            <span>
                              Tipo de acceso:{' '}
                              <strong>
                                {plan.ingresos_incluidos !== null && plan.ingresos_incluidos !== undefined
                                  ? `${plan.ingresos_incluidos} ingresos (Tiquetera)`
                                  : 'Ingresos Ilimitados'}
                              </strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sky-600 font-bold">✓</span>
                            <span>Reserva de clases grupales y rutinas personalizadas</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <span className="block w-full text-center rounded-xl bg-slate-50 border border-slate-200 py-2.5 text-xs font-bold text-slate-700">
                          {esPlanActual ? 'Plan Activo' : 'Disponible en Recepción'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <>
            {cargando && (
              <div className="rounded-xl bg-white p-8 text-center text-sm text-slate-500 shadow-md">
                Cargando el estado de tu membresía...
              </div>
            )}

            {error && (
              <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-200">
                {error}
              </div>
            )}

            {perfilNoEncontrado && (
              <div className="rounded-xl bg-amber-50 p-6 border border-amber-200 text-center">
                <p className="font-semibold text-amber-800 text-base">
                  Perfil de cliente no encontrado
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Tu usuario aún no tiene un perfil de cliente registrado en el sistema. Acércate a la recepción para habilitar tu membresía.
                </p>
              </div>
            )}

            {!cargando && !error && !perfilNoEncontrado && (
              <>
                {/* Tarjeta de Membresía Activa */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Suscripción Actual
                  </h2>

                  {membresiaActiva ? (
                    <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-bold text-slate-900">
                              {membresiaActiva.nombre_plan}
                            </h3>
                            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
                              Vigente
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mt-1">
                            {membresiaActiva.descripcion_plan || 'Plan activo'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-slate-500 block">Precio pagado</span>
                          <span className="text-2xl font-bold text-slate-800">
                            {formatearMoneda(membresiaActiva.precio_pagado)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-emerald-200/60 pt-4 text-sm">
                        <div>
                          <span className="text-slate-500 block text-xs">Fecha de Inicio:</span>
                          <span className="font-semibold text-slate-800">
                            {membresiaActiva.fecha_inicio}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-xs">Fecha de Vencimiento:</span>
                          <span className="font-semibold text-slate-800">
                            {membresiaActiva.fecha_vencimiento}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-xs">Modalidad de Ingresos:</span>
                          <span className="font-semibold text-slate-800">
                            {membresiaActiva.ingresos_incluidos !== null && membresiaActiva.ingresos_incluidos !== undefined
                              ? `${membresiaActiva.ingresos_incluidos} ingresos totales`
                              : 'Ilimitados'}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-emerald-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <span>ℹ️</span>
                          <span>Ventana de cancelación: solo se procesa del día 1 al 5 de cada mes.</span>
                        </div>
                        {/* ⚠️ ESTA ES LA ZONA DONDE ESTABAN LAS ETIQUETAS DUPLICADAS CORREGIDAS ⚠️ */}
                        <button
                          type="button"
                          onClick={() => setModalCancelarAbierto(true)}
                          disabled={!isCancellationWindowOpen()}
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 transition cursor-pointer disabled:opacity-50"
                        >
                          <span>🛑</span>
                          <span>Solicitar Cancelación del Plan</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                      <p className="text-base font-semibold">No tienes una membresía activa en este momento</p>
                      <p className="text-sm mt-1 text-slate-400">
                        Revisa la pestaña "Planes y Membresías Disponibles" para conocer nuestras opciones.
                      </p>
                    </div>
                  )}
                </div>

                {/* Registro de Asistencias del Mes */}
                {asistencias && (
                  <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Mis Asistencias</h2>
                        <p className="text-xs text-slate-500">Mes: {asistencias.mes}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="rounded-xl bg-sky-50 border border-sky-200 px-3 py-1.5 text-xs font-semibold text-sky-800">
                          {asistencias.resumen?.total_asistencias || 0} asistencia{asistencias.resumen?.total_asistencias !== 1 ? 's' : ''} este mes
                        </span>
                      </div>
                    </div>

                    {/* Calendario mensual de asistencias */}
                    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50">
                      <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-500 mb-2">
                        {DIAS_SEMANA.map((d) => (
                          <div key={d}>{d}</div>
                        ))}
                      </div>
                      <div className="grid grid-cols-7 gap-1 text-center text-xs">
                        {Array.from({ length: obtenerOffsetInicio(asistencias.mes) }).map((_, i) => (
                          <div key={`offset-${i}`} className="p-2"></div>
                        ))}
                        {Array.from({ length: obtenerDiasDelMes(asistencias.mes) }).map((_, i) => {
                          const diaNumero = i + 1;
                          const fechaStr = `${asistencias.mes}-${String(diaNumero).padStart(2, '0')}`;
                          const asistio = asistencias.dias_asistidos?.includes(fechaStr);
                          return (
                            <div
                              key={fechaStr}
                              className={`p-2 rounded-lg font-semibold transition ${
                                asistio
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'bg-white text-slate-700 border border-slate-200/60'
                              }`}
                            >
                              {diaNumero}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Historial de Pagos de la membresía activa */}
                {membresiaActiva && pagosActivos.length > 0 && (
                  <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Pagos Registrados</h2>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Fecha</th>
                            <th className="px-4 py-3">Método</th>
                            <th className="px-4 py-3">Monto</th>
                            <th className="px-4 py-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {pagosActivos.map((pago) => (
                            <tr key={pago.id_pago} className="hover:bg-slate-50 transition">
                              <td className="px-4 py-3 text-slate-600">{pago.fecha_pago}</td>
                              <td className="px-4 py-3 font-medium text-slate-800">{pago.metodo_pago}</td>
                              <td className="px-4 py-3 font-semibold text-slate-800">
                                {formatearMoneda(pago.monto)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                    pago.estado_pago === 'Pagado'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {pago.estado_pago}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Historial de Membresías Anteriores */}
                <div className="rounded-2xl bg-white p-6 shadow-md border border-slate-200">
                  <h2 className="text-lg font-bold text-slate-800 mb-4">
                    Historial de Membresías
                  </h2>

                  {historial.length === 0 ? (
                    <div className="p-8 text-center text-sm text-slate-500">
                      No tienes registros en tu historial de membresías.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                          <tr>
                            <th className="px-4 py-3">Plan</th>
                            <th className="px-4 py-3">Fecha Inicio</th>
                            <th className="px-4 py-3">Fecha Vencimiento</th>
                            <th className="px-4 py-3">Precio Pagado</th>
                            <th className="px-4 py-3">Estado</th>
                          </tr>
                        </thead>
                        <tbody>
                          {historial.map((m) => (
                            <tr
                              key={m.id_membresia}
                              className="border-t border-slate-200 hover:bg-slate-50 transition"
                            >
                              <td className="px-4 py-3 font-semibold text-slate-800">
                                {m.nombre_plan}
                              </td>
                              <td className="px-4 py-3 text-slate-600">{m.fecha_inicio}</td>
                              <td className="px-4 py-3 text-slate-600">
                                {m.fecha_vencimiento}
                              </td>
                              <td className="px-4 py-3 font-medium text-slate-800">
                                {formatearMoneda(m.precio_pagado)}
                              </td>
                              <td className="px-4 py-3">
                                <span
                                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                                    m.vigencia === 'Activa'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : m.vigencia === 'Cancelada'
                                      ? 'bg-slate-200 text-slate-700'
                                      : m.vigencia === 'Pendiente'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {m.vigencia}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      <ModalConfirmacion
        abierto={modalCancelarAbierto}
        alCerrar={() => setModalCancelarAbierto(false)}
        alConfirmar={handleConfirmarCancelacionCliente}
        titulo="Solicitud de Cancelación de Plan"
        mensaje={`¿Estás seguro de que deseas cancelar tu plan "${membresiaActiva?.nombre_plan}"? Recuerda que las solicitudes solo se procesan entre el día 1 y 5 de cada mes.`}
        cargando={cancelandoMembresia}
        textoConfirmar="Confirmar Cancelación"
        textoCargando="Procesando..."
      />
    </>
  );
}