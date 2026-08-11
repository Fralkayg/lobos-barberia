import { sheetsConfig } from "../config/sheets";

/**
 * Reads a tab of the public Google Sheet as an array of plain objects,
 * keyed by its header row. Uses the "gviz" endpoint Google exposes for any
 * sheet shared as "Anyone with the link can view" — no API key needed.
 *
 * IMPORTANT: this only ever reads the PUBLIC spreadsheet (Barberos,
 * Servicios, Horarios, Disponibilidad). Customer data lives in a separate,
 * non-public spreadsheet that the Google Form writes to — see
 * docs/google-sheets-setup.md.
 */
export async function fetchSheetRows<T extends Record<string, string>>(
  sheetName: string,
): Promise<T[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetsConfig.spreadsheetId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`No se pudo leer la hoja "${sheetName}" (HTTP ${res.status}).`);
  }

  const text = await res.text();
  const json = parseGvizResponse(text);
  const cols: string[] = json.table.cols.map((c: { label?: string; id: string }) => c.label || c.id);

  return json.table.rows.map((row: { c: Array<{ v: unknown } | null> }) => {
    const obj = {} as Record<string, string>;
    cols.forEach((col, i) => {
      obj[col] = coerceCell(row.c[i]?.v);
    });
    return obj as T;
  });
}

// The gviz endpoint wraps its JSON in a JS callback:
// `/*O_o*/\ngoogle.visualization.Query.setResponse({...});`
function parseGvizResponse(text: string): {
  table: {
    cols: Array<{ label?: string; id: string }>;
    rows: Array<{ c: Array<{ v: unknown } | null> }>;
  };
} {
  const start = text.indexOf("(");
  const end = text.lastIndexOf(")");
  if (start === -1 || end === -1) {
    throw new Error("Respuesta inesperada de Google Sheets. ¿La planilla es pública?");
  }
  return JSON.parse(text.slice(start + 1, end));
}

// Defensive normalization: cells should be plain text/numbers (that's what
// docs/google-sheets-setup.md asks for), but if Sheets auto-detected a
// value as a Date/Time it comes through as a "Date(y,m,d,...)" string —
// unwrap those rather than surfacing garbage.
function coerceCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "string" && value.startsWith("Date(")) {
    const parts = value
      .slice(5, -1)
      .split(",")
      .map((n) => Number(n.trim()));
    const [y, m, d, h = 0, min = 0] = parts;
    const hh = String(h).padStart(2, "0");
    const mm = String(min).padStart(2, "0");
    // Heuristic: a Date() with only y/m/d (h=m=0) is a calendar date;
    // otherwise treat it as a time-of-day value.
    if (h === 0 && min === 0 && parts.length <= 3) {
      return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
    return `${hh}:${mm}`;
  }
  return String(value);
}
