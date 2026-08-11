import { useEffect, useMemo } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert } from "@mui/material";
import { barbersAvailableAt } from "../../lib/slots";
import { resolveAssetUrl } from "../../lib/assetUrl";
import type { Barber, BusySlot, WorkingHour } from "../../sheets/types";

interface Props {
  barbers: Barber[];
  durationMin: number;
  workingHours: WorkingHour[];
  busySlots: BusySlot[];
  date: Date;
  time: string;
  selected: Barber | null;
  onSelect: (barber: Barber) => void;
  preselectedId?: string | null;
}

export default function BarberAtSlotStep({
  barbers,
  durationMin,
  workingHours,
  busySlots,
  date,
  time,
  selected,
  onSelect,
  preselectedId,
}: Props) {
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  const available = useMemo(() => {
    const ids = new Set(
      barbersAvailableAt({
        date: dateStr,
        time,
        barberIds: barbers.map((b) => b.id),
        durationMin,
        workingHours,
        busySlots,
      }),
    );
    return barbers.filter((b) => ids.has(b.id));
  }, [barbers, dateStr, time, durationMin, workingHours, busySlots]);

  // Preseleccionamos si venía elegido desde "Reservar con {barbero}" en la
  // home y sigue disponible a esa hora, o si es el único libre (para no
  // agregar un clic innecesario). Igual queda visible y se puede cambiar.
  useEffect(() => {
    if (selected && available.some((b) => b.id === selected.id)) return;
    const preferred = available.find((b) => b.id === preselectedId) ?? (available.length === 1 ? available[0] : null);
    if (preferred) onSelect(preferred);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [available, preselectedId]);

  if (available.length === 0) {
    return (
      <Alert severity="warning">
        Ese horario ya no tiene barberos disponibles. Vuelve al paso anterior y elige otra hora.
      </Alert>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {available.map((barber) => {
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
            <img src={resolveAssetUrl(barber.photo)} alt={barber.name} className="w-full aspect-[4/3] object-cover" />
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
