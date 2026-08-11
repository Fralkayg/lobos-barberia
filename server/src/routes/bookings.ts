import { Router } from "express";
import { randomUUID } from "node:crypto";
import { appendBooking, getBarbers, getBookings, getServices, getWorkingHours } from "../excelStore.js";
import { addMinutes, computeAvailableSlots } from "../slots.js";
import type { Booking, CreateBookingInput } from "../types.js";

export const bookingsRouter = Router();

const PHONE_RE = /^[0-9+\s()-]{6,20}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: Partial<CreateBookingInput>): string | null {
  if (!body.barberId) return "Falta barberId.";
  if (!body.serviceId) return "Falta serviceId.";
  if (!body.date || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) return "Fecha inválida (YYYY-MM-DD).";
  if (!body.startTime || !/^\d{2}:\d{2}$/.test(body.startTime)) return "Hora de inicio inválida (HH:mm).";
  if (!body.customerName || body.customerName.trim().length < 2) return "Falta el nombre del cliente.";
  if (!body.customerPhone || !PHONE_RE.test(body.customerPhone)) return "Teléfono inválido.";
  if (!body.customerEmail || !EMAIL_RE.test(body.customerEmail)) return "Email inválido.";
  return null;
}

bookingsRouter.post("/", async (req, res) => {
  const body = req.body as Partial<CreateBookingInput>;
  const validationError = validate(body);
  if (validationError) return res.status(400).json({ error: validationError });

  const { barberId, serviceId, date, startTime, customerName, customerPhone, customerEmail } = body;
  const notes = body.notes?.trim() ?? "";

  const barber = getBarbers().find((b) => b.id === barberId && b.active);
  if (!barber) return res.status(404).json({ error: "Barbero no encontrado." });

  const service = getServices().find((s) => s.id === serviceId && s.active);
  if (!service) return res.status(404).json({ error: "Servicio no encontrado." });

  // Re-check availability right before writing to avoid double-booking races.
  const freeSlots = computeAvailableSlots({
    date: date!,
    barberId: barberId!,
    durationMin: service.durationMin,
    workingHours: getWorkingHours(),
    existingBookings: getBookings(),
  });
  if (!freeSlots.includes(startTime!)) {
    return res.status(409).json({ error: "Ese horario ya no está disponible. Elige otro." });
  }

  const booking: Booking = {
    id: randomUUID(),
    barberId: barberId!,
    serviceId: serviceId!,
    date: date!,
    startTime: startTime!,
    endTime: addMinutes(startTime!, service.durationMin),
    customerName: customerName!.trim(),
    customerPhone: customerPhone!.trim(),
    customerEmail: customerEmail!.trim(),
    notes,
    status: "confirmada",
    createdAt: new Date().toISOString(),
  };

  await appendBooking(booking);
  res.status(201).json({ booking, barber, service });
});

/** Simple admin listing, protected by a shared secret header (see .env.example). */
bookingsRouter.get("/", (req, res) => {
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey || req.header("x-admin-key") !== adminKey) {
    return res.status(401).json({ error: "No autorizado." });
  }
  res.json(getBookings());
});
