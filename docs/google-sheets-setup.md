# Configurar Google Sheets + Google Forms como backend

El sitio es 100% estático (se publica en GitHub Pages) y no tiene servidor
propio. En su lugar, el navegador:

- **lee** los barberos, servicios, horarios y disponibilidad directamente
  desde una planilla de Google Sheets pública (de solo lectura), y
- **escribe** cada reserva nueva enviándola directo a un Google Form, que la
  guarda en una planilla privada aparte.

```
GitHub Pages (sitio estático)
   |
   |-- lee  --> Planilla PÚBLICA (Barberos, Servicios, Horarios, Disponibilidad)
   |-- escribe -> Google Form --> Planilla PRIVADA (Reservas, con datos del cliente)
```

Se usan **dos planillas separadas** a propósito: la pública no puede
contener teléfono/email de clientes, porque "pública" en Google Sheets
significa que cualquiera con el link puede ver *toda* la planilla (los
permisos son por archivo, no por pestaña).

Este documento se hace una sola vez. Después, el día a día es editar las
planillas desde Google Sheets normalmente — no hace falta tocar código para
cambiar precios, barberos, horarios, o para cancelar una reserva.

## 1. Crear la planilla privada (Reservas)

1. Entra a [sheets.google.com](https://sheets.google.com) → planilla en
   blanco.
2. Nómbrala, por ejemplo, **"Lobo's Barbería — Reservas (privado)"**.
3. **No la compartas** ni la publiques — déjala con el acceso por defecto
   (solo tú, o quien agregues explícitamente desde el botón
   "Compartir").
4. Anota su URL, la vas a necesitar en el paso 3.

## 2. Crear el Google Form que escribe ahí

1. En [forms.google.com](https://forms.google.com) → formulario en blanco.
2. Nómbralo, por ejemplo, **"Reservar hora — Lobo's Barbería"**.
3. Agrega estas preguntas, **todas de tipo "Respuesta corta"** y **sin
   marcar como obligatorias** (la validación ya la hace el sitio; dejarlas
   opcionales evita que un envío falle si algún día falta un campo):

   | # | Pregunta (el texto no importa, es solo para referencia) |
   | - | -------------------------------------------------------- |
   | 1 | id |
   | 2 | barberId |
   | 3 | serviceId |
   | 4 | date |
   | 5 | startTime |
   | 6 | endTime |
   | 7 | customerName |
   | 8 | customerPhone |
   | 9 | customerEmail |
   | 10 | notes |

4. Pestaña **Respuestas** → ícono de Sheets (verde) → **Seleccionar
   planilla existente** → elige la planilla privada del paso 1. Esto crea
   ahí una pestaña llamada **Reservas** con una columna por pregunta (más
   una columna "Marca temporal" al principio, que agrega Google solo).
5. En esa pestaña **Reservas**, agrega una columna más al final (después de
   "notes"): escribe `status` en el encabezado. Los envíos del formulario
   no la tocan — es para que tú, a mano, escribas `cancelada` en la fila
   de una reserva si el cliente cancela (así el horario vuelve a quedar
   libre). Dejarla vacía significa "confirmada".

### Conseguir la URL de envío y los `entry.XXXXXXX` de cada campo

1. Abre el formulario público (botón "Enviar" → ícono de link).
2. En esa página, con el botón derecho → **Ver código fuente de la
   página** (o `Ctrl+U`).
3. Busca (`Ctrl+F`) `"formResponse"` → copia la URL completa que aparece en
   `<form action="...formResponse" ...>`. Esa es tu `formActionUrl`.
4. Busca `entry.` → vas a encontrar varias apariciones tipo
   `name="entry.1234567890"`, una por cada pregunta, en el mismo orden en
   que las creaste. Anota cuál `entry.XXXXXXX` corresponde a cada pregunta
   (id, barberId, serviceId, etc. — en ese orden).

   Alternativa sin ver código fuente: completa el formulario una vez con
   cualquier dato de prueba, en la pantalla de confirmación toca los tres
   puntos → **Obtener enlace precargado**, complétalo, y copia el link
   generado: cada `entry.XXXXXXX=valor` en esa URL indica qué entry
   corresponde a qué pregunta.

Estos valores se pegan en `client/src/config/sheets.ts` en el paso 4.

## 3. Crear la planilla pública (Datos públicos)

1. Otra planilla en blanco: **"Lobo's Barbería — Datos públicos"**.
2. **Compartir** (arriba a la derecha) → **Cambiar a cualquier persona con
   el enlace** → rol **Lector**. Copia el link.
3. De esa URL se obtiene el `spreadsheetId` (la parte entre `/d/` y
   `/edit`):
   `https://docs.google.com/spreadsheets/d/`**`ESTE_ES_EL_ID`**`/edit`.

### Pestaña "Barberos"

Fila 1 con estos encabezados exactos, después una fila por barbero:

```
id	name	specialty	photo	active
b1	Cristóbal Lobo	Cortes clásicos y fade	/barbers/barber-1.svg	TRUE
b2	Fabián Vidal	Barba y afeitado tradicional	/barbers/barber-2.svg	TRUE
b3	Matías Reyes	Diseños y degradados	/barbers/barber-3.svg	TRUE
```

`photo` puede ser `/barbers/barber-N.svg` (los placeholders que ya vienen
en el sitio) **o el link directo a una foto real** (por ejemplo, una imagen
subida a Google Drive con acceso "Cualquiera con el enlace" — usar el link
de descarga directa, no el de "ver"). Así se puede cambiar la foto de un
barbero sin tocar código.

### Pestaña "Servicios"

```
id	name	durationMin	price	active
s1	Corte Clásico	45	12000	TRUE
s2	Corte + Barba	60	18000	TRUE
s3	Afeitado Tradicional	30	9000	TRUE
s4	Diseño / Fade	45	14000	TRUE
s5	Corte Niño	30	10000	TRUE
```

`durationMin` y `price` van en números; `price` en pesos chilenos, sin
puntos ni signo `$`.

### Pestaña "Horarios"

```
barberId	dayOfWeek	startTime	endTime
ALL	1	12:00	19:00
ALL	2	12:00	19:00
ALL	3	12:00	19:00
ALL	4	12:00	19:00
ALL	5	12:00	19:00
ALL	6	10:00	15:00
```

`dayOfWeek`: 0 = domingo, 1 = lunes … 6 = sábado (no hace falta fila para
domingo si está cerrado). `barberId` = `ALL` aplica a todos los barberos;
si alguno tiene un horario distinto, agrega una fila con su `id` en vez de
`ALL` para ese día — esa fila tiene prioridad sobre la de `ALL`.

**Importante**: antes de escribir `startTime`/`endTime`, selecciona esas
columnas y aplica **Formato → Número → Texto sin formato**. Si no, Sheets
puede convertir "12:00" en un valor de hora internamente y romper la
lectura.

### Pestaña "Disponibilidad" (se llena sola)

Esta es la única pestaña con una fórmula. Trae, en vivo, las reservas de la
planilla privada pero **sin datos del cliente** — es lo que el sitio usa
para calcular horarios ocupados.

1. Fila 1, encabezados a mano: `barberId	serviceId	date	startTime	endTime	status`
2. En la celda **A2**, pega (reemplazando `ID_PLANILLA_PRIVADA` por el ID
   de la planilla del paso 1, obtenido de su URL de la misma forma que en
   el paso 3.3):

   ```
   =QUERY(IMPORTRANGE("ID_PLANILLA_PRIVADA", "Reservas!A2:L"), "SELECT Col3, Col4, Col5, Col6, Col7, Col12 WHERE Col3 IS NOT NULL", 0)
   ```

   Si la planilla está en una configuración regional que usa coma como
   separador decimal (común en español), Sheets espera **punto y coma**
   entre los argumentos de la función en vez de coma — si al pegar la
   fórmula de arriba da `#ERROR!` (error de análisis, no `#REF!`), usa
   esta variante en su lugar (las comas *dentro* del texto
   `"SELECT Col3, Col4, …"` quedan igual — son parte del lenguaje de
   QUERY, no separadores de argumentos):

   ```
   =QUERY(IMPORTRANGE("ID_PLANILLA_PRIVADA"; "Reservas!A2:L"); "SELECT Col3, Col4, Col5, Col6, Col7, Col12 WHERE Col3 IS NOT NULL"; 0)
   ```

3. La primera vez, Sheets va a pedir autorización para conectar las dos
   planillas ("Permitir acceso") — acéptala. Si en vez de datos aparece
   `#REF!`, es justo eso: haz clic en la celda y acepta el permiso.

## 4. Completar la configuración del sitio

Abre [`client/src/config/sheets.ts`](../client/src/config/sheets.ts) y
completa:

```ts
export const sheetsConfig = {
  spreadsheetId: "…",       // ID de la planilla PÚBLICA (paso 3)
  formActionUrl: "…",       // URL que termina en /formResponse (paso 2)
  entryIds: {
    id: "entry.…",
    barberId: "entry.…",
    // … uno por campo, del paso 2
  },
};
```

## 5. Probar

```bash
cd client
npm install
npm run dev
```

Abre `http://localhost:5173`, verifica que carguen los servicios y el
equipo en la home, y completa una reserva de prueba de principio a fin.
Confirma que la fila aparece en la pestaña **Reservas** de la planilla
privada, y que el horario reservado deja de aparecer disponible al volver
a intentar (revisa también la pestaña **Disponibilidad** de la planilla
pública — debería tener una fila nueva).

## Limitaciones a tener en cuenta

- **Sin confirmación real de envío.** Google Forms no permite leer la
  respuesta desde el navegador (no manda cabeceras CORS), así que el sitio
  no puede saber con certeza si la reserva se guardó — solo si la petición
  salió sin errores de red. Es poco frecuente que falle silenciosamente,
  pero puede pasar. Antes de escribir, el sitio vuelve a chequear que el
  horario siga libre, lo que reduce bastante el riesgo de reservas
  duplicadas, aunque no lo elimina del todo (no hay una operación atómica
  como la que tendría un servidor real).
- **Sin notificación automática.** Ni el cliente ni el barbero reciben un
  email/WhatsApp al confirmar. Se puede agregar gratis con un [trigger de
  Google Apps Script](https://developers.google.com/apps-script/guides/triggers/events#form-submit)
  ("al enviarse el formulario, mandar un email") en la planilla privada —
  queda como mejora futura, no está armado por ahora.
- **Los cambios en las planillas tardan un rato en propagarse.** El sitio
  no cachea nada del lado del navegador entre visitas, pero Google sí
  cachea internamente las lecturas públicas por uno o dos minutos.
