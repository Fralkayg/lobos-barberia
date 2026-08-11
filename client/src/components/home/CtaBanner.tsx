import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

export default function CtaBanner() {
  return (
    <section className="bg-gradient-to-r from-brand-charcoal via-brand-black to-brand-charcoal border-y border-brand-gold/15">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-16 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-brand-cream">¿Listo para tu próximo corte?</h2>
        <p className="text-brand-cream/60 mt-3">Elegí tu barbero, tu servicio y el horario que más te acomode.</p>
        <Button component={RouterLink} to="/reservar" size="large" variant="contained" color="primary" className="mt-8">
          Reservar hora
        </Button>
      </div>
    </section>
  );
}
