import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import { business } from "../../config/business";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-black">
      {/* Textura de fondo: franjas sutiles al estilo poste de barbería */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, #c8a250 0px, #c8a250 2px, transparent 2px, transparent 40px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-black/60 to-brand-black" />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6 py-28 md:py-40 flex flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-gold/30 px-4 py-1.5 text-xs tracking-widest text-brand-gold uppercase">
          <ContentCutIcon fontSize="inherit" /> Barbería tradicional · San Bernardo
        </span>

        <h1 className="font-display mt-6 text-6xl md:text-8xl text-brand-cream leading-[0.95]">
          🐺 {business.name.toUpperCase()}
        </h1>

        <p className="mt-6 max-w-xl text-brand-cream/70 text-lg">{business.tagline}.</p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button component={RouterLink} to="/reservar" size="large" variant="contained" color="primary">
            Reservar hora
          </Button>
          <Button component="a" href="#servicios" size="large" variant="outlined" color="primary">
            Ver servicios
          </Button>
        </div>
      </div>
    </section>
  );
}
