import { Router } from "express";
import { getLists, getListById, createList } from "../controllers/lists.controller.js";
import { addTask } from "../controllers/tasks.controller.js";

const r = Router();

// lists
r.get("/", getLists);
r.get("/:id", getListById);
r.post("/", createList);

// tasks under a list
r.post("/:id/tasks", addTask);

export default r;