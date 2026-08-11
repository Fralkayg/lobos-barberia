import { createTheme } from "@mui/material/styles";

// Paleta inspirada en barberías tradicionales: negros profundos, cuero y
// dorado como acento. Coincide con los tokens definidos en index.css para
// que Tailwind y MUI compartan la misma identidad visual.
export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c8a250",
      light: "#ddc487",
      dark: "#a3813a",
      contrastText: "#121012",
    },
    secondary: {
      main: "#7a2020",
      light: "#9a3a3a",
      contrastText: "#f3ede1",
    },
    background: {
      default: "#121012",
      paper: "#1c1917",
    },
    text: {
      primary: "#f3ede1",
      secondary: "#c9c0b3",
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h1: { fontFamily: '"Bebas Neue", "Inter", sans-serif', letterSpacing: "0.04em" },
    h2: { fontFamily: '"Bebas Neue", "Inter", sans-serif', letterSpacing: "0.04em" },
    h3: { fontFamily: '"Bebas Neue", "Inter", sans-serif', letterSpacing: "0.04em" },
    h4: { fontFamily: '"Bebas Neue", "Inter", sans-serif', letterSpacing: "0.04em" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});
