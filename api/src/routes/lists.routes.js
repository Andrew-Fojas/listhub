import { Router } from "express";
import { getLists, getListById, createList, deleteList } from "../controllers/lists.controller.js";
import { addTask } from "../controllers/tasks.controller.js";
import { requireAuth } from "../lib/auth.js";

const r = Router();

// Authentication
r.use(requireAuth);

// lists
r.get("/", getLists);
r.get("/:id", getListById);
r.post("/", createList);
r.delete("/:id", deleteList);

// tasks under a list
r.post("/:id/tasks", addTask);

export default r;