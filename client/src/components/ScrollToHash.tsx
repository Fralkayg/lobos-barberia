import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Al navegar con un hash (p. ej. "/#servicios"), hace scroll a esa sección. */
export default function ScrollToHash() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [hash, pathname]);

  return null;
}
