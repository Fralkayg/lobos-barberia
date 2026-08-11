# 🐺 Lobo's Barbería Tradicional

Sitio web y sistema de reservas online para **Lobo's Barbería Tradicional**
([@lobosbarberiatradicional](https://www.instagram.com/lobosbarberiatradicional/)),
barbería tradicional en San Bernardo, Santiago de Chile.

- **Frontend**: React + TypeScript + Vite, con Material UI (componentes) y
  Tailwind CSS (layout/utilidades), 100% en español.
- **Backend**: API en Node/Express que persiste las reservas en un archivo
  **Excel** (`.xlsx`) en lugar de una base de datos — pensado como solución
  simple para arrancar, fácil de inspeccionar y editar a mano.

## Estructura del proyecto

```
lobos-barberia/
├── client/                  # App React (landing + reservas)
│   ├── src/
│   │   ├── api/             # Cliente HTTP + tipos compartidos con la API
│   │   ├── components/
│   │   │   ├── booking/     # Pasos del flujo de reserva
│   │   │   ├── home/        # Secciones de la landing
│   │   │   └── layout/      # Navbar, Footer, Layout
│   │   ├── config/business.ts  # Datos del negocio (dirección, horario, IG…)
│   │   ├── hooks/           # useBarbers, useServices
│   │   ├── pages/           # HomePage, BookingPage, NotFoundPage
│   │   └── theme.ts         # Tema MUI (paleta de marca)
│   └── public/barbers/      # Fotos de los barberos (placeholders por ahora)
├── server/                  # API de reservas
│   ├── src/
│   │   ├── routes/          # /barbers, /services, /availability, /bookings
│   │   ├── excelStore.ts    # Lectura/escritura del "Excel-DB"
│   │   ├── slots.ts         # Cálculo de horarios disponibles
│   │   ├── seed.ts          # Genera data/lobos-barberia.xlsx con datos base
│   │   └── index.ts         # App Express
│   └── data/lobos-barberia.xlsx   # "Base de datos" (generado, no se versiona)
└── .github/workflows/deploy-pages.yml  # Publica client/ en GitHub Pages
```

## Cómo funciona la reserva (Excel como base de datos)

`server/data/lobos-barberia.xlsx` tiene 4 hojas:

| Hoja        | Contenido                                                        |
| ----------- | ----------------------------------------------------------------- |
| `Barberos`  | id, nombre, especialidad, foto, activo                            |
| `Servicios` | id, nombre, duración (min), precio, activo                        |
| `Horarios`  | horario de atención por barbero (o `ALL` = todos) y día de semana |
| `Reservas`  | reservas confirmadas (se agregan filas nuevas, nunca se editan a mano en caliente) |

Al pedir disponibilidad (`GET /api/availability`), el backend genera franjas
horarias dentro del horario de atención, en pasos de 15 minutos, y descarta
las que se superponen con reservas existentes del mismo barbero+día. Al crear
una reserva (`POST /api/bookings`) se vuelve a validar el horario justo antes
de escribir, para evitar que dos personas reserven el mismo turno a la vez.

Podés abrir el `.xlsx` con Excel/Google Sheets para revisar reservas o editar
barberos/servicios/horarios a mano — solo reiniciá el servidor (o esperá el
próximo request) después de guardar cambios manuales.

## Requisitos previos

- Node.js 20+ y npm

## Puesta en marcha (desarrollo)

```bash
# 1) Backend
cd server
npm install
cp .env.example .env      # valores por defecto ya sirven en local
npm run seed               # crea data/lobos-barberia.xlsx con datos de ejemplo
npm run dev                 # http://localhost:4000

# 2) Frontend (en otra terminal)
cd client
npm install
npm run dev                 # http://localhost:5173 (proxya /api al backend)
```

Con ambos corriendo, abrí `http://localhost:5173`.

## Variables de entorno

**`server/.env`** (ver `server/.env.example`):

| Variable       | Descripción                                          | Default                 |
| -------------- | ----------------------------------------------------- | ------------------------ |
| `PORT`         | Puerto de la API                                       | `4000`                  |
| `CLIENT_ORIGIN`| Origen permitido por CORS                              | `http://localhost:5173` |
| `ADMIN_KEY`    | (opcional) habilita `GET /api/bookings` con header `x-admin-key` para listar reservas | *(vacío = deshabilitado)* |

**`client/.env`** (ver `client/.env.example`):

| Variable        | Descripción                                                  | Default en dev |
| --------------- | -------------------------------------------------------------- | --------------- |
| `VITE_API_URL`  | URL base de la API. En dev no hace falta (usa el proxy de Vite a `/api`); en producción **es obligatoria** si el frontend y el backend no comparten dominio. | `/api` |

## Scripts disponibles

**`server/`**: `npm run dev` (con recarga), `npm run build`, `npm start`
(producción, requiere `build` previo), `npm run seed` (⚠️ pisa
`data/lobos-barberia.xlsx`; solo correrlo si realmente querés reiniciar los
datos de ejemplo/reservas).

**`client/`**: `npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## Despliegue

### Frontend → GitHub Pages

El workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml) publica
`client/` en GitHub Pages en cada push a `main`:

1. En GitHub: **Settings → Pages → Source → GitHub Actions**.
2. En **Settings → Secrets and variables → Actions → Variables**, agregá
   `VITE_API_URL` apuntando a donde hayas desplegado el backend (ver abajo).
   Si no la configurás, el sitio se publica igual pero las secciones que
   dependen de la API (servicios, equipo, reservas) no van a poder cargar
   datos.
3. Al pushear a `main`, el sitio queda en
   `https://<tu-usuario>.github.io/lobos-barberia/`.

> GitHub Pages es hosting estático: **no puede correr el backend Node/Excel**.
> El `.xlsx` necesita un proceso con sistema de archivos escribible.

Detalles técnicos ya resueltos para que esto funcione en un *project site*
(subcarpeta `/lobos-barberia/`, no un dominio propio):

- `vite.config.ts` lee `VITE_BASE_PATH` (el workflow la fija en
  `/lobos-barberia/`) para que los assets se sirvan desde la subruta correcta.
- `client/public/404.html` + un script en `index.html` reescriben rutas
  profundas (p. ej. `/reservar` recargada directamente) de vuelta a la app,
  ya que Pages no tiene rewrites del lado del servidor.
- Si en algún momento pasás a un dominio propio en la raíz, cambiá
  `pathSegmentsToKeep` a `0` en `404.html` y sacá `VITE_BASE_PATH` del workflow.

### Backend → cualquier host con Node (Render, Railway, Fly.io, un VPS…)

1. Desplegá `server/` (build: `npm run build`, start: `npm start`).
2. Configurá `CLIENT_ORIGIN` en ese host con la URL pública del sitio en
   GitHub Pages (p. ej. `https://tu-usuario.github.io`), para que CORS lo
   permita.
3. Asegurate de que el disco donde vive `server/data/` sea persistente (en
   varios hosts "gratis" el filesystem se reinicia en cada deploy — revisá
   la documentación del proveedor elegido).

## Contenido a reemplazar

El scraping público de Instagram solo deja ver dirección, horario y bio —
no teléfono, precios exactos ni nombres del equipo. Quedaron placeholders
marcados con `TODO` para completar con el dueño del local:

- `server/src/seed.ts`: nombres/especialidades de barberos y precios reales
  de `Servicios` (ver historias destacadas "EQUIPO" y "VALORE$" del Instagram).
- `client/src/config/business.ts`: WhatsApp/teléfono de contacto.
- `client/public/barbers/*.svg`: son placeholders — reemplazar por fotos
  reales de cada barbero (mismo nombre de archivo, o actualizar la columna
  `photo` en el Excel).
- `client/src/components/home/Gallery.tsx`: tiles con ícono de relleno —
  reemplazar por fotos reales del local/trabajos.

## Posibles mejoras futuras

- Migrar de Excel a una base de datos real si el volumen de reservas crece.
- Panel de administración autenticado (hoy `GET /api/bookings` es un
  endpoint mínimo protegido por una API key compartida, pensado solo para
  uso interno).
- Notificaciones por email/WhatsApp al confirmar una reserva.
- Code-splitting del bundle del cliente (MUI + date-fns pesan; hoy todo va
  en un solo chunk).
