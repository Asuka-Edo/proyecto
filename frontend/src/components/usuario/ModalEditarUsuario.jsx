import { useEffect, useState } from 'react';
import { CAMPOS_SOLO_DIGITOS, erroresDesdeRespuesta, validarFormularioUsuario } from '../../utils/validaciones.js';

const claseError = 'text-xs font-normal text-red-600';

export function ModalEditarUsuario({ abierto, alCerrar, alGuardar, usuario }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    apellido: '',
    documento_identidad: '',
    correo: '',
    telefono: '',
    codigo_miembro: ''
  });
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (abierto && usuario) {
      setFormulario({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        documento_identidad: usuario.documento_identidad || '',
        correo: usuario.correo || '',
        telefono: usuario.telefono || '',
        codigo_miembro: usuario.codigo_miembro || ''
      });
      setError('');
      setErrores({});
    }
  }, [abierto, usuario]);

  if (!abierto) return null;

  function manejarCambio(e) {
    const { name } = e.target;
    const valor = CAMPOS_SOLO_DIGITOS.includes(name) ? e.target.value.replace(/\D/g, '') : e.target.value;
    setFormulario((prev) => ({ ...prev, [name]: valor }));
    setErrores((prev) => ({ ...prev, [name]: undefined }));
  }

  async function manejarEnvio(e) {
    e.preventDefault();
    setError('');

    // Validar campos de contacto y nombres (sin validar contraseña ya que no se cambia aquí)
    const validacion = validarFormularioUsuario({ ...formulario, contrasena: 'valida123' });
    delete validacion.contrasena;
    setErrores(validacion);
    if (Object.keys(validacion).length > 0) return;

    setEnviando(true);

    try {
      await alGuardar(formulario);
      alCerrar();
    } catch (err) {
      const erroresServidor = erroresDesdeRespuesta(err);
      setErrores(erroresServidor);
      if (Object.keys(erroresServidor).length === 0) {
        setError(err?.message || 'No se pudo actualizar el usuario.');
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden my-8">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Editar Usuario</h2>
            <p className="text-xs text-slate-500 mt-0.5">Modifica los datos personales del usuario</p>
          </div>
          <button
            type="button"
            onClick={alCerrar}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={manejarEnvio} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nombre *</label>
              <input
                type="text"
                name="nombre"
                required
                value={formulario.nombre}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errores.nombre && <p className={claseError}>{errores.nombre}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Apellido *</label>
              <input
                type="text"
                name="apellido"
                required
                value={formulario.apellido}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errores.apellido && <p className={claseError}>{errores.apellido}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Documento de Identidad *</label>
              <input
                type="text"
                name="documento_identidad"
                required
                value={formulario.documento_identidad}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errores.documento_identidad && <p className={claseError}>{errores.documento_identidad}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teléfono</label>
              <input
                type="text"
                name="telefono"
                value={formulario.telefono}
                onChange={manejarCambio}
                placeholder="Ej. 3001234567"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
              {errores.telefono && <p className={claseError}>{errores.telefono}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
            <input
              type="email"
              name="correo"
              required
              value={formulario.correo}
              onChange={manejarCambio}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
            />
            {errores.correo && <p className={claseError}>{errores.correo}</p>}
          </div>

          {usuario?.nombre_rol === 'Cliente' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Código de Miembro</label>
              <input
                type="text"
                name="codigo_miembro"
                value={formulario.codigo_miembro}
                onChange={manejarCambio}
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-sky-500 focus:outline-none"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={alCerrar}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={enviando}
              className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500 disabled:opacity-50 transition cursor-pointer"
            >
              {enviando ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
