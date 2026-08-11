import { Router } from "express";
import { getServices } from "../excelStore.js";

export const servicesRouter = Router();

servicesRouter.get("/", (_req, res) => {
  const services = getServices().filter((s) => s.active);
  res.json(services);
});
