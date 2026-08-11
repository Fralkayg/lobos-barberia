import { CircularProgress } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useServices } from "../../hooks/useServices";
import type { Service } from "../../api/types";

const currency = new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 });

interface Props {
  selected: Service | null;
  onSelect: (service: Service) => void;
}

export default function ServiceStep({ selected, onSelect }: Props) {
  const { services, loading, error } = useServices();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <CircularProgress color="primary" />
      </div>
    );
  }
  if (error) return <p className="text-red-300 text-center py-10">{error}</p>;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {services.map((service) => {
        const isSelected = selected?.id === service.id;
        return (
          <button
            key={service.id}
            type="button"
            onClick={() => onSelect(service)}
            className={`relative text-left rounded-xl border p-5 transition-colors bg-brand-charcoal ${
              isSelected ? "border-brand-gold" : "border-brand-gold/15 hover:border-brand-gold/40"
            }`}
          >
            {isSelected && (
              <CheckCircleIcon sx={{ color: "primary.main" }} className="absolute top-4 right-4" />
            )}
            <h3 className="font-display text-xl text-brand-cream pr-8">{service.name}</h3>
            <div className="mt-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-brand-cream/50 text-sm">
                <AccessTimeIcon fontSize="inherit" /> {service.durationMin} min
              </span>
              <span className="font-display text-xl text-brand-gold">{currency.format(service.price)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
