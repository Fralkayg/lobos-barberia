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
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}

export type BookingStatus = "confirmada" | "cancelada";

export interface Booking {
  id: string;
  barberId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  status: BookingStatus;
  createdAt: string; // ISO timestamp
}

export interface CreateBookingInput {
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}
