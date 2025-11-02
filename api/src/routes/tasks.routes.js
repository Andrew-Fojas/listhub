import { Router } from "express";
import { toggleTask } from "../controllers/tasks.controller.js";

const r = Router();

r.patch("/:id/toggle", toggleTask);

export default r;