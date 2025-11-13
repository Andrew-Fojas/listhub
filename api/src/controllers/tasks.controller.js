import Task from "../models/Task.js";
import List from "../models/List.js";
import { createTaskSchema } from "../validators/tasks.schema.js";

export async function addTask(req, res){
  const email = req.user.email;
  const { id: listId } = req.params;

  // ensure list belongs to user
  const list = await List.findOne({ _id: listId, ownerEmail: email }).lean();
  if (!list) return res.status(404).json({ error: "List not found" });

  const parse = createTaskSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });

  const { title, desc, date, time } = parse.data;

  // stamp ownerEmail on task
  const created = await Task.create({ listId, title, desc, date, time, done: false, ownerEmail: email });

  res.status(201).json({
    id: created._id.toString(),
    listId, title, desc, date, time, done: false
  });
}

export async function toggleTask(req, res){
  const email = req.user.email;
  const { id } = req.params;

  // task must belong to user
  const task = await Task.findOne({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  task.done = !task.done;
  await task.save();

  res.json({
    id: task._id.toString(),
    listId: task.listId.toString(),
    title: task.title, desc: task.desc, date: task.date, time: task.time, done: task.done
  });
}

export async function updateTask(req, res){
  const email = req.user.email;
  const { id } = req.params;
  const { title, desc, date, time } = req.body || {};

  const task = await Task.findOne({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  if (typeof title === "string") task.title = title.trim();
  if (typeof desc  === "string") task.desc  = desc;
  if (typeof date  === "string") task.date  = date;
  if (typeof time  === "string") task.time  = time;
  await task.save();

  res.json({
    id: task._id.toString(),
    listId: task.listId.toString(),
    title: task.title, desc: task.desc, date: task.date, time: task.time, done: task.done
  });
}

export async function deleteTask(req, res){
  const email = req.user.email;
  const { id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, ownerEmail: email });
  if (!task) return res.status(404).json({ error: "Task not found" });

  res.json({ ok: true, id });
}
