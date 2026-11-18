# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Sistema de gestión de gimnasio (gimnasio-bd2). Responde siempre en español.

## Comandos Principales

### Backend (`/backend`)
- **Desarrollo**: `npm run dev` (usa `node --watch src/server.js`)
- **Pruebas (todas)**: `npm test`
- **Prueba individual**: `node --test tests/nombre_del_test.test.js`

### Frontend (`/frontend`)
- **Desarrollo**: `npm run dev`
- **Compilación / Build**: `npm run build`
- **Previsualización de build**: `npm run preview`

---

## Arquitectura y Estructura

### Stack Tecnológico
- **Backend**: Node.js (ES Modules, Express v5), MySQL con `mysql2` (pool.execute y SQL puro; **NO usar ORMs**), MongoDB.
- **Frontend**: React (Vite, React Router DOM v7) + Tailwind CSS.
- **Pruebas Backend**: Test runner nativo (`node --test`) + `supertest`.

### Estructura Backend (`/backend/src`)
- `routes/`: Rutas Express con middlewares de autenticación (`autenticarUsuario`), autorización de roles (`autorizarRoles`) y validación (`validarCamposRequeridos`).
- `controllers/`: Lógica de negocio y validación de reglas de dominio. Respuestas estandarizadas mediante `successResponse` / `errorResponse` (`utils/api-response.js`).
- `models/`: Consultas SQL crudas y modelos de persistencia.
- `app.js` / `server.js`: Configuración y montaje del servidor Express.

### Dominio y Usuarios
- **Roles**: Administrador, Entrenador, Cliente.
- `Cliente` y `Entrenador` son extensiones 1 a 1 de la entidad `Usuario`. Las solicitudes traducen el `id_usuario` extraído del token JWT a `id_cliente` o `id_entrenador` según el contexto del rol.

### Estructura Frontend (`/frontend/src`)
- `services/`: Llamadas e integración con la API del backend.
- `components/`: Componentes reutilizables o por módulo.
- `pages/`: Vistas principales.
- `routes/AppRoutes.jsx`: Control de navegación mediante `ProtectedRoute` especificando `rolPermitido` o `rolesPermitidos`.

---

## Reglas de Desarrollo
1. **Puntos de Cierre en Pruebas**: Los archivos de prueba en backend deben cerrar el pool de conexiones al finalizar: `after(async () => { await pool.end(); });`.
2. **Base de Datos / Migraciones**: Los cambios de base de datos se escriben únicamente como scripts en `backend/database/migrations/` para ejecución manual. Nunca alterar el esquema desde la aplicación.
3. **Modales Frontend**: Todos los modales dentro de una misma página deben agruparse en un único Fragment `<>...</>`. Reutilizar `ModalConfirmacion.jsx` para acciones que requieran confirmación.
4. **Modificaciones Conservadoras**: Realizar cambios mínimos focalizados; no modificar módulos no relacionados con la tarea asignada.
5. **Verificación Previa a Entregar**: Ejecutar `npm test` en backend y `npm run build` en frontend antes de finalizar cualquier cambio.
