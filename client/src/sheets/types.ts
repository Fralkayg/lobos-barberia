export interface Barber {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  durationMin: number;
  price: number;
  active: boolean;
}

/** Working hours. barberId "ALL" applies to every barber unless overridden. */
export interface WorkingHour {
  barberId: string;
  dayOfWeek: number; // 0 = domingo ... 6 = sábado
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

/** Row from the public, PII-free "Disponibilidad" tab. */
export interface BusySlot {
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  status: "confirmada" | "cancelada";
}

/** Everything the booking flow needs, fetched once per visit. */
export interface BookingData {
  barbers: Barber[];
  services: Service[];
  workingHours: WorkingHour[];
  busySlots: BusySlot[];
}
