import { Router } from "express";
import { toggleTask } from "../controllers/tasks.controller.js";
import { updateTask, deleteTask } from "../controllers/tasks.controller.js";
import { requireAuth } from "../lib/auth.js";

const r = Router();

r.use(requireAuth); 

r.patch("/:id/toggle", toggleTask);
r.patch("/:id", updateTask);
r.delete("/:id", deleteTask);

export default r;