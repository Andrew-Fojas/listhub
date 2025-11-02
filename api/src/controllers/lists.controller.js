import List from "../models/List.js";
import Task from "../models/Task.js";

export async function getLists(req, res){
  const lists = await List.find({}).lean();
  // attach counts (optional preview)
  const listIds = lists.map(l => l._id);
  const tasks = await Task.find({ listId: { $in: listIds } }).lean();
  const byList = new Map(listIds.map(id => [id.toString(), []]));
  tasks.forEach(t => byList.get(t.listId.toString()).push(t));

  const withTasks = lists.map(l => ({
    id: l._id.toString(),
    name: l.name,
    tasks: byList.get(l._id.toString())?.map(t => ({
      id: t._id.toString(),
      listId: t.listId.toString(),
      title: t.title, desc: t.desc, done: t.done
    })) ?? []
  }));

  res.json(withTasks);
}

export async function getListById(req, res) {
  const { id } = req.params;

  const list = await List.findById(id).lean();
  if (!list) return res.status(404).json({ error: "List not found" });

  const tasks = await Task.find({ listId: id }).lean();

  res.json({
    id: list._id.toString(),
    name: list.name,
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      listId: t.listId.toString(),
      title: t.title,
      desc: t.desc,
      done: t.done,
    })),
  });
}

export async function createList(req, res){
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "name required" });
  const created = await List.create({ name: name.trim() });
  res.status(201).json({ id: created._id.toString(), name: created.name });
}