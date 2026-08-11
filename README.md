# 🐺 Lobo's Barbería Tradicional

Sitio web y sistema de reservas online para **Lobo's Barbería Tradicional**
([@lobosbarberiatradicional](https://www.instagram.com/lobosbarberiatradicional/)),
barbería tradicional en San Bernardo, Santiago de Chile.

- **Frontend**: React + TypeScript + Vite, con Material UI (componentes) y
  Tailwind CSS (layout/utilidades), 100% en español.
- **Sin backend propio**: el sitio es completamente estático (se publica en
  GitHub Pages) y usa **Google Sheets** como base de datos y **Google
  Forms** para recibir reservas — el navegador habla directo con Google, sin
  ningún servidor que mantener ni pagar.

## Cómo funciona

```
GitHub Pages (sitio estático)
   |
   |-- lee     --> Planilla PÚBLICA (Barberos, Servicios, Horarios, Disponibilidad)
   |-- escribe --> Google Form --> Planilla PRIVADA (Reservas, con datos del cliente)
```

- La **home** y el flujo de **reserva** leen barberos, servicios, horarios
  y horarios ocupados desde una planilla de Google Sheets pública (de solo
  lectura).
- Al confirmar una reserva, el sitio la envía directo a un **Google
  Form**, que la guarda en una planilla **privada** aparte (con nombre,
  teléfono y email del cliente — por eso está separada de la pública).
- El cálculo de horarios disponibles (¿qué barbero está libre tal día a tal
  hora, según su horario de atención y las reservas ya tomadas?) se hace
  en el navegador, en `client/src/lib/slots.ts`.

Ver **[docs/google-sheets-setup.md](docs/google-sheets-setup.md)** para la
guía paso a paso de cómo crear y conectar las planillas y el formulario —
es la parte que hay que hacer una sola vez antes de que el sitio tenga
datos reales.

## Estructura del proyecto

```
lobos-barberia/
├── client/                  # Toda la app (no hay servidor)
│   ├── src/
│   │   ├── sheets/          # Lectura (gviz) y escritura (Google Form) de Sheets
│   │   ├── lib/slots.ts     # Cálculo de disponibilidad (puro, sin red)
│   │   ├── config/
│   │   │   ├── sheets.ts    # IDs de planilla/formulario a completar (ver docs/)
│   │   │   └── business.ts  # Datos del negocio (dirección, horario, Instagram…)
│   │   ├── components/
│   │   │   ├── booking/     # Pasos del flujo de reserva
│   │   │   ├── home/        # Secciones de la landing
│   │   │   └── layout/      # Navbar, Footer, Layout
│   │   ├── hooks/           # useBarbers, useServices, useBookingData
│   │   └── pages/           # HomePage, BookingPage, NotFoundPage
│   └── public/barbers/      # Fotos de los barberos (placeholders por ahora)
├── docs/google-sheets-setup.md   # Guía de configuración de Sheets + Forms
└── .github/workflows/deploy-pages.yml  # Publica client/ en GitHub Pages
```

## El flujo de reserva

1. **Servicio** — define la duración usada para calcular horarios.
2. **Fecha y hora** — calendario; al elegir una fecha aparecen los horarios
   en los que *algún* barbero está libre.
3. **Barbero** — solo se muestran los barberos libres en ese horario
   exacto; si hay más de uno, el cliente elige con quién.
4. **Datos del cliente** — nombre, teléfono, email, notas.
5. Confirmar envía la reserva al Google Form.

## Requisitos previos

- Node.js 20+ y npm
- Una cuenta de Google para las planillas/formulario (ver
  [docs/google-sheets-setup.md](docs/google-sheets-setup.md))

## Puesta en marcha (desarrollo)

```bash
cd client
npm install
npm run dev   # http://localhost:5173
```

Sin completar `client/src/config/sheets.ts` (ver la guía de configuración),
el sitio carga igual pero las secciones que dependen de datos —
servicios, equipo, disponibilidad, reservas — muestran un mensaje de error
en vez de datos.

## Scripts disponibles

`npm run dev`, `npm run build`, `npm run preview`, `npm run lint`.

## Despliegue en GitHub Pages

El workflow [`deploy-pages.yml`](.github/workflows/deploy-pages.yml)
publica `client/` en GitHub Pages en cada push a `main`:

1. En GitHub: **Settings → Pages → Source → GitHub Actions**.
2. Al hacer push a `main`, el sitio queda en
   `https://<tu-usuario>.github.io/lobos-barberia/`.

No hay backend que desplegar por separado ni variables de entorno que
configurar en GitHub — todo lo que el sitio necesita vive en
`client/src/config/sheets.ts`, que se commitea como cualquier otro archivo
(no es secreto: el navegador ya lo expone en el bundle público).

Detalles técnicos ya resueltos para que esto funcione en un *project site*
(subcarpeta `/lobos-barberia/`, no un dominio propio):

- `vite.config.ts` lee `VITE_BASE_PATH` (el workflow la fija en
  `/lobos-barberia/`) para que los assets se sirvan desde la subruta
  correcta.
- `client/src/lib/assetUrl.ts` resuelve rutas de imágenes que vienen de la
  planilla (como `/barbers/barber-1.svg`) contra esa misma subruta —
  necesario porque Vite no puede reescribir strings que llegan en
  tiempo de ejecución desde Sheets, solo referencias que ve al compilar.
- `client/public/404.html` + un script en `index.html` reescriben rutas
  profundas (p. ej. `/reservar` recargada directamente) de vuelta a la app,
  ya que Pages no tiene rewrites del lado del servidor.
- Si en algún momento se pasa a un dominio propio en la raíz, cambiar
  `pathSegmentsToKeep` a `0` en `404.html` y quitar `VITE_BASE_PATH` del
  workflow.

## Contenido a reemplazar

El scraping público de Instagram solo deja ver dirección, horario y bio —
no teléfono, precios exactos ni nombres del equipo. Quedan placeholders
para completar con el dueño del local, directamente en las planillas de
Google Sheets (sin tocar código):

- Nombres/especialidades/fotos reales de los barberos, y precios reales de
  los servicios (ver historias destacadas "EQUIPO" y "VALORE$" del
  Instagram) — pestañas **Barberos** y **Servicios** de la planilla
  pública.
- `client/src/config/business.ts`: WhatsApp/teléfono de contacto.
- `client/src/components/home/Gallery.tsx`: tiles con ícono de relleno —
  reemplazar por fotos reales del local/trabajos.

## Posibles mejoras futuras

- Notificación automática por email al barbero/cliente al confirmar una
  reserva (Google Apps Script trigger sobre la planilla privada — ver
  [docs/google-sheets-setup.md](docs/google-sheets-setup.md)).
- Code-splitting del bundle del cliente (MUI + date-fns pesan; hoy todo va
  en un solo chunk).
- Si el volumen de reservas crece lo suficiente como para que la
  protección contra dobles reservas de Sheets/Forms se quede corta, migrar
  a un backend real con una base de datos.
