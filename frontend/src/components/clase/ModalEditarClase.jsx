import { useEffect, useState } from 'react';
import { actualizarClase, parsearErrorBackend } from '../../services/clase.service.js';

export function ModalEditarClase({ abierto, alCerrar, alGuardar, clase }) {
  const [nombreClase, setNombreClase] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [capacidadMaxima, setCapacidadMaxima] = useState(20);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (abierto && clase) {
      setNombreClase(clase.nombre_clase || '');
      setDescripcion(clase.descripcion || '');
      setCapacidadMaxima(clase.capacidad_maxima || 20);
      setError('');
    }
  }, [abierto, clase]);

  if (!abierto) return null;

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    if (!nombreClase.trim()) {
      setError('El nombre de la clase es obligatorio.');
      return;
    }

    const cap = Number(capacidadMaxima);
    if (isNaN(cap) || cap <= 0) {
      setError('La capacidad máxima debe ser un número mayor a 0.');
      return;
    }

    setEnviando(true);
    try {
      await actualizarClase(clase.id_clase, {
        nombre_clase: nombreClase.trim(),
        descripcion: descripcion.trim() || undefined,
        capacidad_maxima: cap
      });
      alGuardar();
      alCerrar();
    } catch (err) {
      setError(parsearErrorBackend(err));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90dvh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl animate-in fade-in zoom-in duration-150">
        <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-800">Editar Clase</h2>
          <button
            type="button"
            onClick={alCerrar}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        <form onSubmit={manejarEnvio} className="space-y-4">
          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre de la Clase *
            </label>
            <input
              type="text"
              required
              value={nombreClase}
              onChange={(e) => setNombreClase(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Capacidad Máxima *
            </label>
            <input
              type="number"
              min={1}
              required
              value={capacidadMaxima}
              onChange={(e) => setCapacidadMaxima(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={alCerrar}
              disabled={enviando}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-md bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 transition disabled:opacity-50 cursor-pointer"
            >
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
