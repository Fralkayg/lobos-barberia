import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import type { CreateBookingResponse } from "../../api/types";

const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

interface Props {
  result: CreateBookingResponse;
  onBookAnother: () => void;
}

export default function ConfirmationStep({ result, onBookAnother }: Props) {
  const { booking, barber, service } = result;
  const prettyDate = new Date(`${booking.date}T00:00:00`).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="max-w-lg mx-auto text-center py-6">
      <CheckCircleIcon sx={{ fontSize: 64, color: "primary.main" }} />
      <h2 className="font-display text-4xl text-brand-cream mt-4">¡Reserva confirmada!</h2>
      <p className="text-brand-cream/60 mt-2">
        Te esperamos. Guardá estos datos, también te sirven para recordar tu turno.
      </p>

      <div className="mt-8 rounded-xl border border-brand-gold/15 bg-brand-charcoal p-6 text-left space-y-4">
        <div className="flex items-center gap-3">
          <PersonIcon sx={{ color: "primary.main" }} />
          <span className="text-brand-cream/90">
            Con <strong>{barber.name}</strong>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ContentCutIcon sx={{ color: "primary.main" }} />
          <span className="text-brand-cream/90">
            {service.name} · {currency.format(service.price)}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <EventIcon sx={{ color: "primary.main" }} />
          <span className="text-brand-cream/90 capitalize">
            {prettyDate} a las {booking.startTime} hs
          </span>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button component={RouterLink} to="/" variant="outlined" color="primary">
          Volver al inicio
        </Button>
        <Button onClick={onBookAnother} variant="contained" color="primary">
          Reservar otra hora
        </Button>
      </div>
    </div>
  );
}
