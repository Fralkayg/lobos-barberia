import { Router } from "express";
import { getBarbers, getBookings, getServices, getWorkingHours } from "../excelStore.js";
import { computeAvailableSlots } from "../slots.js";

export const availabilityRouter = Router();

availabilityRouter.get("/", (req, res) => {
  const { barberId, serviceId, date } = req.query;

  if (typeof barberId !== "string" || typeof serviceId !== "string" || typeof date !== "string") {
    return res.status(400).json({ error: "Se requiere barberId, serviceId y date (YYYY-MM-DD)." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: "El parámetro date debe tener el formato YYYY-MM-DD." });
  }

  const barber = getBarbers().find((b) => b.id === barberId && b.active);
  if (!barber) return res.status(404).json({ error: "Barbero no encontrado." });

  const service = getServices().find((s) => s.id === serviceId && s.active);
  if (!service) return res.status(404).json({ error: "Servicio no encontrado." });

  const slots = computeAvailableSlots({
    date,
    barberId,
    durationMin: service.durationMin,
    workingHours: getWorkingHours(),
    existingBookings: getBookings(),
  });

  res.json({ date, barberId, serviceId, durationMin: service.durationMin, slots });
});
