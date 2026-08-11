import type { BusySlot, WorkingHour } from "../sheets/types";

const SLOT_STEP_MIN = 15;
const MIN_LEAD_MIN = 30; // no permitir reservar en los próximos 30 min

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function toHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60)
    .toString()
    .padStart(2, "0");
  const m = (minutes % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** Parses a "YYYY-MM-DD" string as a local date (avoids UTC off-by-one). */
export function parseLocalDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function findWorkingHours(
  workingHours: WorkingHour[],
  barberId: string,
  dayOfWeek: number,
): WorkingHour | undefined {
  return (
    workingHours.find((w) => w.barberId === barberId && w.dayOfWeek === dayOfWeek) ??
    workingHours.find((w) => w.barberId === "ALL" && w.dayOfWeek === dayOfWeek)
  );
}

export interface AvailabilityParams {
  date: string; // YYYY-MM-DD
  barberId: string;
  durationMin: number;
  workingHours: WorkingHour[];
  busySlots: BusySlot[];
  now?: Date;
}

/** Returns the list of free "HH:mm" start times for one barber on one day. */
export function computeAvailableSlots({
  date,
  barberId,
  durationMin,
  workingHours,
  busySlots,
  now = new Date(),
}: AvailabilityParams): string[] {
  const day = parseLocalDate(date);
  const hours = findWorkingHours(workingHours, barberId, day.getDay());
  if (!hours) return [];

  const openMin = toMinutes(hours.startTime);
  const closeMin = toMinutes(hours.endTime);

  const busy = busySlots
    .filter((b) => b.barberId === barberId && b.date === date && b.status !== "cancelada")
    .map((b) => ({ start: toMinutes(b.startTime), end: toMinutes(b.endTime) }));

  const isToday = day.toDateString() === now.toDateString();
  const earliestToday = now.getHours() * 60 + now.getMinutes() + MIN_LEAD_MIN;

  const slots: string[] = [];
  for (let start = openMin; start + durationMin <= closeMin; start += SLOT_STEP_MIN) {
    if (isToday && start < earliestToday) continue;
    const end = start + durationMin;
    const overlaps = busy.some((b) => start < b.end && end > b.start);
    if (!overlaps) slots.push(toHHMM(start));
  }
  return slots;
}

export interface AggregatedAvailabilityParams {
  date: string;
  barberIds: string[];
  durationMin: number;
  workingHours: WorkingHour[];
  busySlots: BusySlot[];
  now?: Date;
}

/**
 * A time is offered if AT LEAST ONE barber is free then — this backs the
 * "pick a date, then a time" flow, where the barber is picked afterwards
 * from whoever's actually free at that slot.
 */
export function computeAggregatedSlots(params: AggregatedAvailabilityParams): string[] {
  const set = new Set<string>();
  for (const barberId of params.barberIds) {
    for (const slot of computeAvailableSlots({ ...params, barberId })) {
      set.add(slot);
    }
  }
  return [...set].sort();
}

/** Which of the given barbers are free for this exact date+time+duration. */
export function barbersAvailableAt(params: AggregatedAvailabilityParams & { time: string }): string[] {
  return params.barberIds.filter((barberId) =>
    computeAvailableSlots({ ...params, barberId }).includes(params.time),
  );
}

export function addMinutes(hhmm: string, minutes: number): string {
  return toHHMM(toMinutes(hhmm) + minutes);
}
