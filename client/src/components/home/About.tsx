import ContentCutIcon from "@mui/icons-material/ContentCut";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import VerifiedIcon from "@mui/icons-material/Verified";

const pillars = [
  { icon: ContentCutIcon, label: "Cortes clásicos y modernos" },
  { icon: StorefrontIcon, label: "Ambiente tradicional de barrio" },
  { icon: PeopleAltIcon, label: "Atención personalizada" },
  { icon: VerifiedIcon, label: "Productos y herramientas premium" },
];

export default function About() {
  return (
    <section className="bg-brand-black">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-20 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <span className="text-xs tracking-widest text-brand-gold uppercase">Nuestra esencia</span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-cream mt-2">
            Barbería de barrio, oficio tradicional
          </h2>
          <p className="mt-5 text-brand-cream/70 leading-relaxed">
            En Lobo's creemos en el ritual de la barbería de toda la vida: navaja, tijera y buena
            conversación. Cada corte se hace con calma y cuidado, combinando técnicas clásicas con
            los estilos que se usan hoy, para que salgas del sillón exactamente como lo pediste.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pillars.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-brand-gold/15 bg-brand-charcoal p-5"
            >
              <Icon sx={{ color: "primary.main" }} />
              <span className="text-brand-cream/85 text-sm font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
