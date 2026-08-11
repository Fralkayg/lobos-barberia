import { Link as RouterLink } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useServices } from "../../hooks/useServices";

const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

export default function Services() {
  const { services, loading, error } = useServices();

  return (
    <section id="servicios" className="bg-brand-charcoal">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-brand-gold uppercase">Nuestros servicios</span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-cream mt-2">Valores</h2>
          <p className="text-brand-cream/60 text-sm mt-2">
            Precios de referencia — pueden variar según el barbero y el largo del cabello.
          </p>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <CircularProgress color="primary" size={28} />
          </div>
        )}
        {error && <p className="text-center text-red-300">{error}</p>}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl border border-brand-gold/15 bg-brand-black p-6 flex flex-col gap-3 hover:border-brand-gold/40 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-2xl text-brand-cream">{service.name}</h3>
                <span className="font-display text-2xl text-brand-gold whitespace-nowrap">
                  {currency.format(service.price)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-brand-cream/50 text-sm">
                <AccessTimeIcon fontSize="inherit" />
                {service.durationMin} min
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <Button component={RouterLink} to="/reservar" variant="contained" color="primary" size="large">
            Reservar hora
          </Button>
        </div>
      </div>
    </section>
  );
}
