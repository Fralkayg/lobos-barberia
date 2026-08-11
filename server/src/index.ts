import cors from "cors";
import "dotenv/config";
import express from "express";
import { barbersRouter } from "./routes/barbers.js";
import { bookingsRouter } from "./routes/bookings.js";
import { servicesRouter } from "./routes/services.js";
import { availabilityRouter } from "./routes/availability.js";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/barbers", barbersRouter);
app.use("/api/services", servicesRouter);
app.use("/api/availability", availabilityRouter);
app.use("/api/bookings", bookingsRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor." });
});

app.listen(PORT, () => {
  console.log(`🐺 API de Lobos Barbería escuchando en http://localhost:${PORT}`);
});
