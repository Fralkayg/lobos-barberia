import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";
import type { Barber, Booking, Service, WorkingHour } from "./types.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const DATA_DIR = join(__dirname, "..", "data");
export const DATA_FILE = join(DATA_DIR, "lobos-barberia.xlsx");

const SHEETS = {
  barbers: "Barberos",
  services: "Servicios",
  workingHours: "Horarios",
  bookings: "Reservas",
} as const;

/** Simple write queue so concurrent requests don't corrupt the workbook. */
let writeQueue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => T): Promise<T> {
  const result = writeQueue.then(task);
  // Swallow errors here so one failed write doesn't jam the whole queue;
  // the caller still gets the rejection via the returned promise.
  writeQueue = result.catch(() => undefined);
  return result;
}

function ensureDataFile() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  if (!existsSync(DATA_FILE)) {
    throw new Error(
      `No se encontró ${DATA_FILE}. Corre "npm run seed" en /server antes de iniciar la API.`,
    );
  }
}

function readWorkbook(): XLSX.WorkBook {
  ensureDataFile();
  return XLSX.readFile(DATA_FILE);
}

function sheetToRows<T>(wb: XLSX.WorkBook, sheetName: string): T[] {
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return [];
  return XLSX.utils.sheet_to_json<T>(sheet, { defval: "" });
}

export function getBarbers(): Barber[] {
  const wb = readWorkbook();
  return sheetToRows<Barber>(wb, SHEETS.barbers).map((b) => ({
    ...b,
    active: normalizeBool((b as unknown as Record<string, unknown>).active),
  }));
}

export function getServices(): Service[] {
  const wb = readWorkbook();
  return sheetToRows<Service>(wb, SHEETS.services).map((s) => ({
    ...s,
    durationMin: Number((s as unknown as Record<string, unknown>).durationMin),
    price: Number((s as unknown as Record<string, unknown>).price),
    active: normalizeBool((s as unknown as Record<string, unknown>).active),
  }));
}

export function getWorkingHours(): WorkingHour[] {
  const wb = readWorkbook();
  return sheetToRows<WorkingHour>(wb, SHEETS.workingHours).map((h) => ({
    ...h,
    dayOfWeek: Number((h as unknown as Record<string, unknown>).dayOfWeek),
  }));
}

export function getBookings(): Booking[] {
  const wb = readWorkbook();
  return sheetToRows<Booking>(wb, SHEETS.bookings);
}

function normalizeBool(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return String(value).trim().toUpperCase() === "TRUE" || String(value).trim() === "1";
}

/**
 * Appends a booking row to the workbook and persists it to disk.
 * Runs through a write queue to serialize concurrent requests.
 */
export function appendBooking(booking: Booking): Promise<void> {
  return enqueue(() => {
    const wb = readWorkbook();
    const existing = sheetToRows<Booking>(wb, SHEETS.bookings);
    const updated = [...existing, booking];
    wb.Sheets[SHEETS.bookings] = XLSX.utils.json_to_sheet(updated, {
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
    });
    XLSX.writeFile(wb, DATA_FILE);
  });
}

export { SHEETS };
