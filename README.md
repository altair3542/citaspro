# CitasPro (React + Tailwind + Supabase) — Proyecto por sesiones

CitasPro es un proyecto formativo y progresivo (7 sesiones) para construir una aplicación web moderna con **React**, **Tailwind CSS** y **Supabase**. La meta es que el equipo aprenda mediante un **proyecto continuo**, aplicando prácticas actuales de estructura de código, ruteo, componentes reutilizables, autenticación y persistencia de datos.

---

## 1) Objetivo del proyecto

Construir una SPA (Single Page Application) orientada a **gestión de citas** (clientes + agenda), con:

- UI consistente (componentes reutilizables).
- Rutas públicas y privadas.
- Autenticación (Supabase Auth).
- Persistencia (Supabase Postgres) con políticas de seguridad (RLS).
- Operaciones CRUD (clientes y citas).
- Buenas prácticas de estructura y mantenimiento del código.

---

## 2) Tecnologías (stack)

- **Vite**: entorno de desarrollo y build moderno.
- **React**: UI declarativa basada en componentes.
- **Tailwind CSS**: utilidades para estilos consistentes y escalables.
- **React Router**: navegación en cliente (SPA).
- **Supabase**: Auth + base de datos + API (a partir de sesiones posteriores).

> Nota: En la **Sesión 1** dejamos listo el esqueleto de la app (Vite + Tailwind + Router + Layout + páginas públicas).

---

## 3) Requisitos previos (local)

- **Node.js** (idealmente LTS).
- **npm** (incluido con Node) o gestor equivalente.
- **Git** (recomendado).
- Editor: VS Code (recomendado) o similar.

### Windows (PowerShell) — problema típico con npm
Si al ejecutar `npm` en PowerShell aparece un error relacionado con políticas de ejecución (scripts no firmados), puedes habilitarlo para tu usuario:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

Alternativa temporal (solo para esa sesión de terminal):

```powershell
Set-ExecutionPolicy -Scope Process Bypass
```

---

## 4) Setup inicial (Quickstart)

### 4.1 Crear el proyecto con Vite (React)
Si el repo ya existe, salta al paso de instalación.

```bash
npm create vite@latest citaspro -- --template react
cd citaspro
npm install
npm run dev
```

Abre el navegador en la URL que indique la consola (típicamente `http://localhost:5173`).

### 4.2 Instalar Tailwind (enfoque moderno con plugin de Vite)
En la raíz del proyecto:

```bash
npm install tailwindcss @tailwindcss/vite
```

Edita `vite.config.js`:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```

Edita `src/index.css`:

```css
@import "tailwindcss";
```

Verifica Tailwind agregando clases a un componente (por ejemplo, `text-3xl`, `bg-gray-50`, etc.).

### 4.3 Instalar React Router
```bash
npm install react-router-dom
```

---

## 5) Scripts disponibles

- Levantar entorno de desarrollo:
  ```bash
  npm run dev
  ```

- Construir para producción:
  ```bash
  npm run build
  ```

- Previsualizar build local:
  ```bash
  npm run preview
  ```

---

## 6) Estructura de carpetas (convención inicial)

Proponemos una estructura sencilla pero escalable por “capas” y “features”:

```txt
src/
  app/
    router.jsx
  layouts/
    RootLayout.jsx
  pages/
    HomePage.jsx
  features/
    auth/
      pages/
        LoginPage.jsx
        SignupPage.jsx
    dashboard/
      pages/
        DashboardPage.jsx
  shared/
    components/
      ui/
        Button.jsx
        Card.jsx
        Input.jsx
        Spinner.jsx
    lib/
      cn.js
  main.jsx
  index.css
```

### 6.1 Racional de la estructura
- `app/`: configuración central (router y, más adelante, providers).
- `features/`: módulos funcionales (auth, dashboard, citas, clientes).
- `shared/`: piezas reutilizables por toda la aplicación (UI, utilidades).
- `layouts/`: estructura común (navbar, contenedores, outlet de rutas).
- `pages/`: páginas de propósito general (por ejemplo: Home).

---

## 7) Ruteo y Layout

La app usa rutas dentro de un `RootLayout` con `Outlet` (router de React Router). Inicialmente incluimos:

- `/` → Home
- `/login` → Login
- `/signup` → Signup
- `/dashboard` → Dashboard (placeholder; será ruta protegida en la sesión de Auth)

> En sesiones posteriores se implementará protección de rutas (guards) y redirecciones según sesión de usuario.

---

## 8) Componentes UI mínimos (shared/ui)

Desde el inicio trabajamos con componentes UI sencillos para:
- Evitar repetición de clases Tailwind.
- Mantener consistencia visual.
- Preparar escalabilidad (variantes, estados, validaciones).

Componentes iniciales:
- `Button`
- `Input`
- `Card`
- `Spinner`

Utilidad:
- `cn.js` para composición de clases.

---

## 9) Variables de entorno (preparación para Supabase)

A partir de la sesión de integración con Supabase necesitaremos variables de entorno con prefijo `VITE_` (requisito de Vite).

Crea un archivo `.env.local` (no se debe commitear) con:

```bash
VITE_SUPABASE_URL="https://TU-PROYECTO.supabase.co"
VITE_SUPABASE_ANON_KEY="TU-ANON-KEY"
```

### 9.1 Buenas prácticas
- `.env.local` debe estar en `.gitignore`.
- Nunca publiques keys privadas (service role) en frontend.
- La anon key es pública, pero aun así se protege el acceso real mediante RLS en la base de datos.

---

## 10) Roadmap por sesiones (qué vamos a construir)

Este README acompaña un temario de 7 sesiones. En alto nivel:

1. **Sesión 1**: Setup moderno (Vite + Tailwind + Router + UI base + páginas públicas).
2. **Sesión 2**: Dashboard con datos simulados (mock), estados UI (empty/loading/error), filtros básicos.
3. **Sesión 3**: CRUD de Clientes (frontend completo con mock + UI de formularios).
4. **Sesión 4**: Auth con Supabase (signup/login/logout, rutas protegidas, sesión persistente).
5. **Sesión 5**: CRUD real con Supabase (tablas, RLS, insertar/leer/editar/eliminar).
6. **Sesión 6**: Citas (modelado, relaciones, calendario/listado, validaciones, UX).
7. **Sesión 7**: Deploy + hardening (env vars, buenas prácticas, ajustes finales, demo).

> Este roadmap se puede ajustar según el ritmo del grupo.

---

## 11) Convenciones de trabajo (recomendadas)

### 11.1 Nombres y estilo
- Componentes React: `PascalCase` (ej. `LoginPage.jsx`)
- Funciones/variables: `camelCase`
- Rutas: `kebab-case` si se agrega más adelante (ej. `/reset-password`)

### 11.2 Importaciones
- Evitar imports profundos innecesarios.
- Mantener rutas relativamente estables con estructura consistente (features/shared/app).

### 11.3 Commits (opcional pero recomendado)
Formato sugerido (convencional):
- `feat: ...` nueva funcionalidad
- `fix: ...` corrección
- `chore: ...` tareas técnicas
- `docs: ...` documentación
- `refactor: ...` refactor sin cambio funcional

Ejemplo:
```txt
feat: add public routes and root layout
```

---

## 12) Calidad de código (opcional en fase inicial)

Si quieres robustecer desde el inicio:

### 12.1 ESLint (si no viene ya configurado)
```bash
npm install -D eslint
```

### 12.2 Prettier
```bash
npm install -D prettier
```

Luego agrega scripts (ejemplo) en `package.json`:
```json
{
  "scripts": {
    "format": "prettier . --write"
  }
}
```

> Podemos incorporar reglas específicas cuando el proyecto crezca (import sorting, hooks rules, etc.).

---

## 13) Troubleshooting

### 13.1 “Tailwind no aplica estilos”
Checklist:
- `vite.config.js` incluye `tailwindcss()` en plugins.
- `src/index.css` contiene `@import "tailwindcss";`
- `main.jsx` importa `./index.css`.
- Reinicia el servidor (`Ctrl+C` y `npm run dev`).

### 13.2 “El router no navega / 404 en refresh”
En desarrollo con Vite normalmente funciona. En deploy se requiere configurar fallback a `index.html` para rutas SPA (lo resolvemos en sesión de Deploy).

---

## 14) Entregable mínimo (Sesión 1)

Al finalizar la Sesión 1 el repo debe incluir:
- Proyecto levantando con `npm run dev`.
- Tailwind funcionando (se evidencia en UI).
- Router con rutas públicas y layout base.
- Componentes UI mínimos (Button/Input/Card/Spinner).
- Este README actualizado.

---

## 15) Licencia
Proyecto educativo/formativo (define licencia si aplica).
