import Task from "../models/Task.js";
import List from "../models/List.js";
import { createTaskSchema } from "../validators/tasks.schema.js";

export async function addTask(req, res){
  const { id: listId } = req.params;
  const list = await List.findById(listId).lean();
  if (!list) return res.status(404).json({ error: "List not found" });

  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { title, desc } = parse.data;
  const created = await Task.create({ listId, title, desc, done: false });
  res.status(201).json({
    id: created._id.toString(),
    listId, title, desc, done: false
  });
}

export async function toggleTask(req, res){
  const { id } = req.params;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  task.done = !task.done;
  await task.save();
  res.json({
    id: task._id.toString(),
    listId: task.listId.toString(),
    title: task.title, desc: task.desc, done: task.done
  });
}

// (optional) delete/edit for later:
// export async function deleteTask(...) {}
// export async function updateTask(...) {}