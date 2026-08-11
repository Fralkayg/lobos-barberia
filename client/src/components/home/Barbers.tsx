import { Link as RouterLink } from "react-router-dom";
import { Button, CircularProgress } from "@mui/material";
import { useBarbers } from "../../hooks/useBarbers";

export default function Barbers() {
  const { barbers, loading, error } = useBarbers();

  return (
    <section id="equipo" className="bg-brand-black">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-brand-gold uppercase">Conocé al equipo</span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-cream mt-2">Nuestros barberos</h2>
        </div>

        {loading && (
          <div className="flex justify-center py-10">
            <CircularProgress color="primary" size={28} />
          </div>
        )}
        {error && <p className="text-center text-red-300">{error}</p>}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber) => (
            <div
              key={barber.id}
              className="rounded-xl border border-brand-gold/15 bg-brand-charcoal overflow-hidden text-center hover:border-brand-gold/40 transition-colors"
            >
              <img src={barber.photo} alt={barber.name} className="w-full aspect-square object-cover" />
              <div className="p-5">
                <h3 className="font-display text-2xl text-brand-cream">{barber.name}</h3>
                <p className="text-brand-cream/60 text-sm mt-1">{barber.specialty}</p>
                <Button
                  component={RouterLink}
                  to={`/reservar?barberId=${barber.id}`}
                  size="small"
                  variant="outlined"
                  color="primary"
                  className="mt-4"
                >
                  Reservar con {barber.name.split(" ")[0]}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
