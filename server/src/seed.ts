/**
 * Creates the Excel "database" with starter data so the API has something
 * to serve on first run. Safe to re-run: it OVERWRITES data/lobos-barberia.xlsx,
 * so re-seed only when you actually want to reset bookings.
 *
 * Usage: npm run seed
 */
import { existsSync, mkdirSync } from "node:fs";
import XLSX from "xlsx";
import { DATA_DIR, DATA_FILE } from "./excelStore.js";
import type { Barber, Booking, Service, WorkingHour } from "./types.js";

// TODO: reemplaza estos datos de ejemplo por el equipo, servicios y precios
// reales de Lobos Barbería Tradicional (ver historias destacadas "EQUIPO" y
// "VALORE$" en @lobosbarberiatradicional).
const barbers: Barber[] = [
  { id: "b1", name: "Cristóbal Lobo", specialty: "Cortes clásicos y fade", photo: "/barbers/barber-1.svg", active: true },
  { id: "b2", name: "Fabián Vidal", specialty: "Barba y afeitado tradicional", photo: "/barbers/barber-2.svg", active: true },
  { id: "b3", name: "Matías Reyes", specialty: "Diseños y degradados", photo: "/barbers/barber-3.svg", active: true },
];

const services: Service[] = [
  { id: "s1", name: "Corte Clásico", durationMin: 45, price: 12000, active: true },
  { id: "s2", name: "Corte + Barba", durationMin: 60, price: 18000, active: true },
  { id: "s3", name: "Afeitado Tradicional", durationMin: 30, price: 9000, active: true },
  { id: "s4", name: "Diseño / Fade", durationMin: 45, price: 14000, active: true },
  { id: "s5", name: "Corte Niño", durationMin: 30, price: 10000, active: true },
];

// Horario según Instagram: Lun-Vie 12:00-19:00, Sáb 10:00-15:00, Dom cerrado.
// barberId "ALL" = aplica a todos los barberos salvo que se agregue una fila
// específica para un barbero puntual.
const workingHours: WorkingHour[] = [
  { barberId: "ALL", dayOfWeek: 1, startTime: "12:00", endTime: "19:00" },
  { barberId: "ALL", dayOfWeek: 2, startTime: "12:00", endTime: "19:00" },
  { barberId: "ALL", dayOfWeek: 3, startTime: "12:00", endTime: "19:00" },
  { barberId: "ALL", dayOfWeek: 4, startTime: "12:00", endTime: "19:00" },
  { barberId: "ALL", dayOfWeek: 5, startTime: "12:00", endTime: "19:00" },
  { barberId: "ALL", dayOfWeek: 6, startTime: "10:00", endTime: "15:00" },
];

const bookings: Booking[] = [];

function build() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(barbers), "Barberos");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(services), "Servicios");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(workingHours), "Horarios");
  XLSX.utils.book_append_sheet(
    wb,
    XLSX.utils.json_to_sheet(bookings, {
      header: [
        "id",
        "barberId",
        "serviceId",
        "date",
        "startTime",
        "endTime",
        "customerName",
        "customerPhone",
        "customerEmail",
        "notes",
        "status",
        "createdAt",
      ],
    }),
    "Reservas",
  );

  XLSX.writeFile(wb, DATA_FILE);
  console.log(`✔ Base de datos Excel creada en ${DATA_FILE}`);
}

build();
