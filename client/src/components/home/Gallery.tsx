import ContentCutIcon from "@mui/icons-material/ContentCut";
import FaceRetouchingNaturalIcon from "@mui/icons-material/FaceRetouchingNatural";
import StyleIcon from "@mui/icons-material/Style";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import BrushIcon from "@mui/icons-material/Brush";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InstagramIcon from "@mui/icons-material/Instagram";
import { business } from "../../config/business";

// Placeholders con ícono mientras se suben fotos reales del local/trabajos.
// TODO: reemplazar por fotos reales (ver carpeta client/public/gallery).
const tiles = [
  { icon: ContentCutIcon, gradient: "from-brand-gold/25 to-transparent" },
  { icon: FaceRetouchingNaturalIcon, gradient: "from-brand-red/30 to-transparent" },
  { icon: StyleIcon, gradient: "from-brand-gold/20 to-transparent" },
  { icon: LocalFireDepartmentIcon, gradient: "from-brand-red/25 to-transparent" },
  { icon: BrushIcon, gradient: "from-brand-gold/25 to-transparent" },
  { icon: EmojiEventsIcon, gradient: "from-brand-red/20 to-transparent" },
];

export default function Gallery() {
  return (
    <section id="galeria" className="bg-brand-charcoal">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-20">
        <div className="text-center mb-12">
          <span className="text-xs tracking-widest text-brand-gold uppercase">Nuestro trabajo</span>
          <h2 className="font-display text-4xl md:text-5xl text-brand-cream mt-2">Galería</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {tiles.map(({ icon: Icon, gradient }, i) => (
            <div
              key={i}
              className={`aspect-square rounded-xl border border-brand-gold/15 bg-gradient-to-br ${gradient} bg-brand-black flex items-center justify-center`}
            >
              <Icon sx={{ fontSize: 40, color: "rgba(243,237,225,0.35)" }} />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 text-brand-gold hover:text-brand-gold-light transition-colors font-medium"
          >
            <InstagramIcon /> Ver más en {business.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  );
}
