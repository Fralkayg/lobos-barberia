import axios from "axios";
import type {
  AvailabilityResponse,
  Barber,
  CreateBookingPayload,
  CreateBookingResponse,
  Service,
} from "./types";

// En desarrollo, Vite redirige /api al backend (ver vite.config.ts).
// En producción, definí VITE_API_URL apuntando a la URL pública de la API.
const api = axios.create({
  // "||" (not "??") on purpose: an unset Pages repo variable comes through
  // as an empty string, which should also fall back to the relative path.
  baseURL: import.meta.env.VITE_API_URL || "/api",
});

export async function fetchBarbers(): Promise<Barber[]> {
  const { data } = await api.get<Barber[]>("/barbers");
  return data;
}

export async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get<Service[]>("/services");
  return data;
}

export async function fetchAvailability(params: {
  barberId: string;
  serviceId: string;
  date: string;
}): Promise<AvailabilityResponse> {
  const { data } = await api.get<AvailabilityResponse>("/availability", { params });
  return data;
}

export async function createBooking(
  payload: CreateBookingPayload,
): Promise<CreateBookingResponse> {
  const { data } = await api.post<CreateBookingResponse>("/bookings", payload);
  return data;
}

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.error;
    if (typeof message === "string") return message;
  }
  return "Ocurrió un error inesperado. Intentá nuevamente.";
}
