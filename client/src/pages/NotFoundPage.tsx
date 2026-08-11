import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";

export default function NotFoundPage() {
  return (
    <section className="bg-brand-black min-h-[70vh] flex items-center justify-center">
      <div className="text-center px-4">
        <h1 className="font-display text-6xl text-brand-gold">404</h1>
        <p className="text-brand-cream/70 mt-3">Esta página no existe.</p>
        <Button component={RouterLink} to="/" variant="contained" color="primary" className="mt-8">
          Volver al inicio
        </Button>
      </div>
    </section>
  );
}
