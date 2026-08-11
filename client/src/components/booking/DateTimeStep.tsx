import { useEffect, useState } from "react";
import { addDays, format, isSunday } from "date-fns";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { Alert, Chip, CircularProgress } from "@mui/material";
import { fetchAvailability, getApiErrorMessage } from "../../api/client";

interface Props {
  barberId: string;
  serviceId: string;
  date: Date | null;
  time: string | null;
  onChangeDate: (date: Date | null) => void;
  onChangeTime: (time: string) => void;
}

const TODAY = new Date();
const MAX_DATE = addDays(TODAY, 30);

export default function DateTimeStep({ barberId, serviceId, date, time, onChangeDate, onChangeTime }: Props) {
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!date) {
      setSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchAvailability({ barberId, serviceId, date: format(date, "yyyy-MM-dd") })
      .then((res) => {
        if (!cancelled) setSlots(res.slots);
      })
      .catch((err) => {
        if (!cancelled) setError(getApiErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [barberId, serviceId, date?.getTime()]);

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="rounded-xl border border-brand-gold/15 bg-brand-charcoal p-2 flex justify-center">
        <DateCalendar
          value={date}
          onChange={(newDate) => {
            onChangeDate(newDate);
          }}
          minDate={TODAY}
          maxDate={MAX_DATE}
          shouldDisableDate={(d) => isSunday(d as Date)}
        />
      </div>

      <div>
        <h3 className="font-display text-xl text-brand-cream mb-4">Horarios disponibles</h3>
        {!date && <p className="text-brand-cream/50 text-sm">Elegí una fecha para ver los horarios.</p>}
        {date && loading && (
          <div className="flex justify-center py-10">
            <CircularProgress color="primary" size={26} />
          </div>
        )}
        {date && error && <Alert severity="error">{error}</Alert>}
        {date && !loading && !error && slots.length === 0 && (
          <Alert severity="info">No hay horarios disponibles ese día. Probá con otra fecha.</Alert>
        )}
        {date && !loading && slots.length > 0 && (
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
