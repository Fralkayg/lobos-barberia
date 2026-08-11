import { Link as RouterLink } from "react-router-dom";
import InstagramIcon from "@mui/icons-material/Instagram";
import PlaceIcon from "@mui/icons-material/Place";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { business } from "../../config/business";

export default function Footer() {
  return (
    <footer className="border-t border-brand-gold/15 bg-brand-charcoal">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <span className="font-display text-3xl text-brand-gold">🐺 {business.name}</span>
          <p className="mt-3 text-brand-cream/70 text-sm max-w-xs">{business.tagline}</p>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-brand-cream/80 hover:text-brand-gold transition-colors text-sm"
          >
            <InstagramIcon fontSize="small" />
            {business.instagramHandle}
          </a>
        </div>

        <div>
          <h3 className="font-display text-xl text-brand-gold mb-3">Ubicación</h3>
          <a
            href={business.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-start gap-2 text-brand-cream/80 hover:text-brand-gold transition-colors text-sm"
          >
            <PlaceIcon fontSize="small" className="mt-0.5 shrink-0" />
            <span>
              {business.address}
              <br />
              {business.addressNote}
            </span>
          </a>
        </div>

        <div>
          <h3 className="font-display text-xl text-brand-gold mb-3">Horario</h3>
          <ul className="space-y-1.5 text-sm text-brand-cream/80">
            {business.hours.map((h) => (
              <li key={h.label} className="flex items-center gap-2">
                <ScheduleIcon fontSize="small" className="text-brand-gold/70" />
                <span className="font-medium">{h.label}:</span> {h.value}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-gold/10 py-5">
        <p className="text-center text-xs text-brand-cream/40">
          © {new Date().getFullYear()} {business.name}. Todos los derechos reservados. ·{" "}
          <RouterLink to="/reservar" className="hover:text-brand-gold">
            Reservar hora
          </RouterLink>
        </p>
      </div>
    </footer>
  );
}
