import { Button } from "@mui/material";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DirectionsIcon from "@mui/icons-material/Directions";
import { business } from "../../config/business";

export default function Location() {
  return (
    <section id="ubicacion" className="bg-brand-black">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-20 grid gap-10 md:grid-cols-2">
        <div className="rounded-xl border border-brand-gold/15 bg-brand-charcoal p-8">
          <div className="flex items-center gap-2 text-brand-gold mb-4">
            <PlaceIcon />
            <h3 className="font-display text-2xl">Cómo llegar</h3>
          </div>
          <p className="text-brand-cream/80">{business.address}</p>
          <p className="text-brand-cream/50 text-sm mt-1">{business.addressNote}</p>
          <Button
            component="a"
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            startIcon={<DirectionsIcon />}
            variant="outlined"
            color="primary"
            className="mt-6"
          >
            Ver en el mapa
          </Button>
        </div>

        <div className="rounded-xl border border-brand-gold/15 bg-brand-charcoal p-8">
          <div className="flex items-center gap-2 text-brand-gold mb-4">
            <ScheduleIcon />
            <h3 className="font-display text-2xl">Horario de atención</h3>
          </div>
          <ul className="divide-y divide-brand-gold/10">
            {business.hours.map((h) => (
              <li key={h.label} className="flex justify-between py-2.5 text-brand-cream/80">
                <span>{h.label}</span>
                <span className="font-medium">{h.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
