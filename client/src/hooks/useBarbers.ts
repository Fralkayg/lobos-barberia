import { useEffect, useState } from "react";
import { fetchBarbers } from "../sheets/repository";
import type { Barber } from "../sheets/types";

export function useBarbers() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchBarbers()
      .then((data) => {
        if (!cancelled) setBarbers(data);
      })
      .catch(() => {
        if (!cancelled) setError("No pudimos cargar el equipo. Intenta de nuevo en unos segundos.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { barbers, loading, error };
}
