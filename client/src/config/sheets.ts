// Configuración de la "base de datos" en Google Sheets + Google Forms.
// No hay backend: el sitio es 100% estático y el navegador lee/escribe
// directo contra Google. Ver docs/google-sheets-setup.md para crear las
// hojas y el formulario, y completar los valores de acá.
//
// Nada de esto es secreto (el navegador lo expone igual en el bundle
// público), así que no hace falta pasarlo por variables de entorno.

export const sheetsConfig = {
  // ID de la planilla PÚBLICA (la que tiene Barberos/Servicios/Horarios/
  // Disponibilidad). Se ve en su URL:
  // https://docs.google.com/spreadsheets/d/ESTE_ES_EL_ID/edit
  spreadsheetId: "12aKOZuusi4aSHLewxVgEVVWdicO0MkuTQZg832zeQFk",

  // URL de envío del Google Form ("Obtener enlace precompletado" o
  // inspeccionar el <form action="..."> de la página del formulario;
  // termina en /formResponse).
  formActionUrl: "https://docs.google.com/forms/u/0/d/e/1FAIpQLSdL7br49YjRZfIuvghVHApgjRyjgnIVRfxsiZnS_sRN-wnkXA/formResponse",

  // IDs de cada campo del formulario (entry.XXXXXXXXX). Se obtienen desde
  // "Obtener enlace precompletado" en Google Forms: completa el formulario
  // de prueba, genera el link, y copia el entry.XXXXXXXXX de cada campo.
  entryIds: {
    id: "entry.1321148154",
    barberId: "entry.607272546",
    serviceId: "entry.1049187450",
    date: "entry.379324577",
    startTime: "entry.1747421591",
    endTime: "entry.498248975",
    customerName: "entry.1855930314",
    customerPhone: "entry.66743609",
    customerEmail: "entry.786167094",
    notes: "entry.726293020",
  },
};

export function isSheetsConfigured(): boolean {
  return (
    !sheetsConfig.spreadsheetId.startsWith("TODO") &&
    !sheetsConfig.formActionUrl.includes("TODO") &&
    Object.values(sheetsConfig.entryIds).every((v) => !v.includes("TODO"))
  );
}
