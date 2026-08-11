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

export interface AvailabilityResponse {
  date: string;
  barberId: string;
  serviceId: string;
  durationMin: number;
  slots: string[];
}

export interface Booking {
  id: string;
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  endTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes: string;
  status: "confirmada" | "cancelada";
  createdAt: string;
}

export interface CreateBookingPayload {
  barberId: string;
  serviceId: string;
  date: string;
  startTime: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  notes?: string;
}

export interface CreateBookingResponse {
  booking: Booking;
  barber: Barber;
  service: Service;
}
