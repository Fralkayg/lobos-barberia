import { Router } from "express";
import { getBarbers } from "../excelStore.js";

export const barbersRouter = Router();

barbersRouter.get("/", (_req, res) => {
  const barbers = getBarbers().filter((b) => b.active);
  res.json(barbers);
});
