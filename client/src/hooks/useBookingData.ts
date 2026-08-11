import { useCallback, useEffect, useState } from "react";
import { fetchBookingData } from "../sheets/repository";
import type { BookingData } from "../sheets/types";

const EMPTY: BookingData = { barbers: [], services: [], workingHours: [], busySlots: [] };

export function useBookingData() {
  const [data, setData] = useState<BookingData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetchBookingData()
      .then(setData)
      .catch(() => {
        setError("No pudimos conectar con la planilla de reservas. Recarga la página en unos segundos.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...data, loading, error, refetch: load };
}
