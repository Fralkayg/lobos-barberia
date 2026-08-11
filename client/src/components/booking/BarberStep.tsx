import { useEffect } from "react";
import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useBarbers } from "../../hooks/useBarbers";
import type { Barber } from "../../api/types";

interface Props {
  selected: Barber | null;
  onSelect: (barber: Barber) => void;
  preselectedId?: string | null;
}

export default function BarberStep({ selected, onSelect, preselectedId }: Props) {
  const { barbers, loading, error } = useBarbers();

  // Si se llegó desde "Reservar con {barbero}" en la home, preseleccionarlo
  // apenas se cargue la lista.
  useEffect(() => {
    if (!selected && preselectedId) {
      const match = barbers.find((b) => b.id === preselectedId);
      if (match) onSelect(match);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barbers, preselectedId]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress color="primary" />
      </div>
    );
  }
  if (error) return <p className="text-red-300 text-center py-10">{error}</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {barbers.map((barber) => {
        const isSelected = selected?.id === barber.id;
        return (
          <button
            key={barber.id}
            type="button"
            onClick={() => onSelect(barber)}
            className={`relative text-left rounded-xl border overflow-hidden transition-colors bg-brand-charcoal ${
              isSelected ? "border-brand-gold" : "border-brand-gold/15 hover:border-brand-gold/40"
            }`}
          >
            {isSelected && (
              <CheckCircleIcon sx={{ color: "primary.main" }} className="absolute top-3 right-3 z-10" />
            )}
            <img src={barber.photo} alt={barber.name} className="w-full aspect-[4/3] object-cover" />
            <div className="p-4">
              <h3 className="font-display text-xl text-brand-cream">{barber.name}</h3>
              <p className="text-brand-cream/60 text-sm">{barber.specialty}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
