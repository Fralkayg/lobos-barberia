import { fetchSheetRows } from "./gviz";
import { toBool, toNumber } from "./normalize";
import type { Barber, BookingData, BusySlot, Service, WorkingHour } from "./types";

export async function fetchBarbers(): Promise<Barber[]> {
  const rows = await fetchSheetRows<Record<string, string>>("Barberos");
  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      specialty: r.specialty,
      photo: r.photo,
      active: toBool(r.active),
    }))
    .filter((b) => b.active);
}

export async function fetchServices(): Promise<Service[]> {
  const rows = await fetchSheetRows<Record<string, string>>("Servicios");
  return rows
    .map((r) => ({
      id: r.id,
      name: r.name,
      durationMin: toNumber(r.durationMin),
      price: toNumber(r.price),
      active: toBool(r.active),
    }))
    .filter((s) => s.active);
}

export async function fetchWorkingHours(): Promise<WorkingHour[]> {
  const rows = await fetchSheetRows<Record<string, string>>("Horarios");
  return rows.map((r) => ({
    barberId: r.barberId,
    dayOfWeek: toNumber(r.dayOfWeek),
    startTime: r.startTime,
    endTime: r.endTime,
  }));
}

export async function fetchBusySlots(): Promise<BusySlot[]> {
  const rows = await fetchSheetRows<Record<string, string>>("Disponibilidad");
  return rows.map((r) => ({
    barberId: r.barberId,
    serviceId: r.serviceId,
    date: r.date,
    startTime: r.startTime,
    endTime: r.endTime,
    status: r.status === "cancelada" ? "cancelada" : "confirmada",
  }));
}

/** Fetches everything the booking flow needs in one go. */
export async function fetchBookingData(): Promise<BookingData> {
  const [barbers, services, workingHours, busySlots] = await Promise.all([
    fetchBarbers(),
    fetchServices(),
    fetchWorkingHours(),
    fetchBusySlots(),
  ]);
  return { barbers, services, workingHours, busySlots };
}
