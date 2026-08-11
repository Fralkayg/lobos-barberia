import { useMemo } from "react";
import { isSunday } from "date-fns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Alert, Chip } from "@mui/material";
import { computeAggregatedSlots } from "../../lib/slots";
import type { BusySlot, WorkingHour } from "../../sheets/types";

interface Props {
  barberIds: string[];
  durationMin: number;
  workingHours: WorkingHour[];
  busySlots: BusySlot[];
  date: Date | null;
  time: string | null;
  onChangeDate: (date: Date | null) => void;
  onChangeTime: (time: string) => void;
}

const TODAY = new Date();
const MAX_DATE = new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate() + 30);

export default function DateTimeStep({
  barberIds,
  durationMin,
  workingHours,
  busySlots,
  date,
  time,
  onChangeDate,
  onChangeTime,
}: Props) {
  // Todo esto ya está en memoria (se cargó una vez en BookingPage), así que
  // no hay fetch ni loading acá: el cálculo es instantáneo.
  const slots = useMemo(() => {
    if (!date) return [];
    const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return computeAggregatedSlots({ date: dateStr, barberIds, durationMin, workingHours, busySlots });
  }, [date, barberIds, durationMin, workingHours, busySlots]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-brand-gold/15 bg-brand-charcoal p-2 flex justify-center">
        <DateCalendar
          value={date}
          onChange={(newDate) => onChangeDate(newDate)}
          minDate={TODAY}
          maxDate={MAX_DATE}
          shouldDisableDate={(d) => isSunday(d as Date)}
        />
      </div>

      <div>
        <h3 className="font-display text-xl text-brand-cream mb-4">Horarios disponibles</h3>
        {!date && <p className="text-brand-cream/50 text-sm">Elige una fecha para ver los horarios.</p>}
        {date && slots.length === 0 && (
          <Alert severity="info">No hay horarios disponibles ese día. Prueba con otra fecha.</Alert>
        )}
        {date && slots.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {slots.map((slot) => (
              <Chip
                key={slot}
                label={slot}
                clickable
                onClick={() => onChangeTime(slot)}
                color={time === slot ? "primary" : "default"}
                variant={time === slot ? "filled" : "outlined"}
                sx={time !== slot ? { borderColor: "rgba(200,162,80,0.3)", color: "text.primary" } : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
