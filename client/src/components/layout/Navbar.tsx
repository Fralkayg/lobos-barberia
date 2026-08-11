import { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { AppBar, Box, Button, Drawer, IconButton, List, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { business } from "../../config/business";

const links = [
  { label: "Servicios", hash: "#servicios" },
  { label: "Equipo", hash: "#equipo" },
  { label: "Galería", hash: "#galeria" },
  { label: "Ubicación", hash: "#ubicacion" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      {links.map((link) =>
        isHome ? (
          <a
            key={link.hash}
            href={link.hash}
            onClick={onClick}
            className="text-brand-cream/80 hover:text-brand-gold transition-colors text-sm font-medium tracking-wide"
          >
            {link.label}
          </a>
        ) : (
          <RouterLink
            key={link.hash}
            to={`/${link.hash}`}
            onClick={onClick}
            className="text-brand-cream/80 hover:text-brand-gold transition-colors text-sm font-medium tracking-wide"
          >
            {link.label}
          </RouterLink>
        ),
      )}
    </>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "rgba(18, 16, 18, 0.9)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(200, 162, 80, 0.15)",
      }}
    >
      <Toolbar className="mx-auto w-full max-w-6xl px-4 md:px-6" sx={{ py: 1 }}>
        <RouterLink to="/" className="flex items-center gap-2 no-underline">
          <span className="font-display text-3xl text-brand-gold leading-none">🐺 {business.shortName.toUpperCase()}</span>
        </RouterLink>

        <Box sx={{ flexGrow: 1 }} />

        <Box className="hidden md:flex items-center gap-8">
          <NavLinks />
          <Button component={RouterLink} to="/reservar" variant="contained" color="primary">
            Reservar hora
          </Button>
        </Box>

        <IconButton
          className="md:hidden"
          onClick={() => setOpen(true)}
          sx={{ color: "primary.main" }}
          aria-label="Abrir menú"
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260, height: "100%", bgcolor: "background.paper", p: 3 }} className="flex flex-col gap-6">
          <Box className="flex justify-end">
            <IconButton onClick={() => setOpen(false)} sx={{ color: "text.primary" }} aria-label="Cerrar menú">
              <CloseIcon />
            </IconButton>
          </Box>
          <List className="flex flex-col gap-4">
            <NavLinks onClick={() => setOpen(false)} />
          </List>
          <Button
            component={RouterLink}
            to="/reservar"
            onClick={() => setOpen(false)}
            variant="contained"
            color="primary"
            fullWidth
          >
            Reservar hora
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
