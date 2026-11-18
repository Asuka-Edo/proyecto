import { useEffect, useState } from 'react';
import { ModalPlan } from '../components/membresia/ModalPlan.jsx';
import { ModalConfirmacion } from '../components/membresia/ModalConfirmacion.jsx';
import { formatearMoneda } from '../utils/moneda.js';
import {
  actualizarPlan,
  crearPlan,
  eliminarPlan,
  obtenerPlanes
} from '../services/plan.service.js';

export function PlanesAdminPage() {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [modalAbierto, setModalAbierto] = useState(false);
  const [planAEditar, setPlanAEditar] = useState(null);
  const [planAEliminar, setPlanAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  useEffect(() => {
    document.title = 'Gestión de Planes | Gimnasio';
    cargarPlanes();
  }, []);

  async function cargarPlanes() {
    setCargando(true);
    setError('');
    try {
      const respuesta = await obtenerPlanes(true);
      setPlanes(respuesta.data || []);
    } catch (err) {
      setError(err?.message || 'No se pudieron cargar los planes.');
    } finally {
      setCargando(false);
    }
  }

  function abrirNuevoPlan() {
    setPlanAEditar(null);
    setModalAbierto(true);
  }

  function abrirEditarPlan(plan) {
    setPlanAEditar(plan);
    setModalAbierto(true);
  }

  async function guardarPlan(datos) {
    if (planAEditar) {
      await actualizarPlan(planAEditar.id_plan, datos);
    } else {
      await crearPlan(datos);
    }
    await cargarPlanes();
  }

  async function cambiarEstadoActivo(plan) {
    const nuevoEstado = !plan.activo;
    try {
      await actualizarPlan(plan.id_plan, { activo: nuevoEstado });
      setPlanes((prev) =>
        prev.map((item) => (item.id_plan === plan.id_plan ? { ...item, activo: nuevoEstado } : item))
      );
    } catch (err) {
      setError(err?.message || 'No se pudo actualizar el estado del plan.');
    }
  }

  async function confirmarEliminarPlan() {
    if (!planAEliminar) return;

    setEliminando(true);
    try {
      await eliminarPlan(planAEliminar.id_plan);
      setPlanAEliminar(null);
      await cargarPlanes();
    } catch (err) {
      setError(err?.message || 'No se pudo eliminar el plan.');
    } finally {
      setEliminando(false);
    }
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Catálogo de Planes</h1>
            <p className="text-sm text-slate-600 mt-1">
              Administra los planes de suscripción ofrecidos en el gimnasio (duración, precio e ingresos).
            </p>
          </div>
          <button
            type="button"
            onClick={abrirNuevoPlan}
            className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-500 transition cursor-pointer"
          >
            + Nuevo Plan
          </button>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
              {cargando ? (
                <div className="p-8 text-center text-slate-500">Cargando planes...</div>
              ) : planes.length === 0 ? (
                <div className="p-8 text-center text-slate-500">No hay planes registrados.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Nombre del Plan</th>
                      <th className="px-4 py-3">Duración</th>
                      <th className="px-4 py-3">Ingresos</th>
                      <th className="px-4 py-3">Precio</th>
                      <th className="px-4 py-3">Estado</th>
                      <th className="px-4 py-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {planes.map((plan) => (
                      <tr key={plan.id_plan} className="hover:bg-slate-50 transition">
                        <td className="px-4 py-3 font-semibold text-slate-800">
                          {plan.nombre_plan}
                          {plan.descripcion && (
                            <span className="block text-xs font-normal text-slate-500">
                              {plan.descripcion}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600">{plan.duracion_dias} días</td>
                        <td className="px-4 py-3 text-slate-600">
                          {plan.ingresos_incluidos !== null && plan.ingresos_incluidos !== undefined ? (
                            <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
                              {plan.ingresos_incluidos} ingresos
                            </span>
                          ) : (
                            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                              Ilimitado
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {formatearMoneda(plan.precio)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${
                              plan.activo
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {plan.activo ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => abrirEditarPlan(plan)}
                              className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => cambiarEstadoActivo(plan)}
                              className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white transition cursor-pointer ${
                                plan.activo
                                  ? 'bg-amber-600 hover:bg-amber-700'
                                  : 'bg-emerald-600 hover:bg-emerald-700'
                              }`}
                            >
                              {plan.activo ? 'Desactivar' : 'Activar'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setPlanAEliminar(plan)}
                              className="rounded-lg bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition cursor-pointer"
                              title="Eliminar plan"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
      </div>

      <ModalPlan
        abierto={modalAbierto}
        alCerrar={() => setModalAbierto(false)}
        alGuardar={guardarPlan}
        plan={planAEditar}
      />

      <ModalConfirmacion
        abierto={Boolean(planAEliminar)}
        alCerrar={() => setPlanAEliminar(null)}
        alConfirmar={confirmarEliminarPlan}
        titulo="Eliminar Plan"
        mensaje={`¿Estás seguro de que deseas eliminar el plan "${planAEliminar?.nombre_plan}"? No se podrá eliminar si ya tiene clientes con membresías asociadas.`}
        cargando={eliminando}
        textoConfirmar="Sí, eliminar"
        textoCargando="Eliminando..."
      />
    </>
  );
}
