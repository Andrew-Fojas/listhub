import List from "../models/List.js";
import Task from "../models/Task.js";

export async function getLists(req, res){
  const email = req.user.email; // scope by current user

  // only this user's lists
  const lists = await List.find({ ownerEmail: email }).lean();

  // attach task previews for these lists, scoped to this user
  const listIds = lists.map(l => l._id);
  const tasks = await Task.find({ listId: { $in: listIds }, ownerEmail: email }).lean();

  const byList = new Map(listIds.map(id => [id.toString(), []]));
  tasks.forEach(t => byList.get(t.listId.toString()).push(t));

  const withTasks = lists.map(l => ({
    id: l._id.toString(),
    name: l.name,
    tasks: byList.get(l._id.toString())?.map(t => ({
      id: t._id.toString(),
      listId: t.listId.toString(),
      title: t.title, desc: t.desc, date: t.date, time: t.time, done: t.done
    })) ?? []
  }));

  res.json(withTasks);
}

export async function getListById(req, res) {
  const email = req.user.email;
  const { id } = req.params;

  // only allow fetching the user's own list
  const list = await List.findOne({ _id: id, ownerEmail: email }).lean();
  if (!list) return res.status(404).json({ error: "List not found" });

  // only this user's tasks for that list
  const tasks = await Task.find({ listId: id, ownerEmail: email }).lean();

  res.json({
    id: list._id.toString(),
    name: list.name,
    tasks: tasks.map((t) => ({
      id: t._id.toString(),
      listId: t.listId.toString(),
      title: t.title,
      desc: t.desc,
      date: t.date,
      time: t.time,
      done: t.done,
    })),
  });
}

export async function createList(req, res){
  const email = req.user.email; // 👈
  const { name } = req.body || {};
  if (!name?.trim()) return res.status(400).json({ error: "name required" });

  // stamp ownerEmail
  const created = await List.create({ name: name.trim(), ownerEmail: email });

  res.status(201).json({ id: created._id.toString(), name: created.name, tasks: [] });
}

export async function deleteList(req, res) {
  const email = req.user.email; // 👈
  const { id } = req.params;

  // ensure the list belongs to this user
  const list = await List.findOne({ _id: id, ownerEmail: email });
  if (!list) return res.status(404).json({ error: "List not found" });

  // remove only this user's tasks for this list
  await Task.deleteMany({ listId: id, ownerEmail: email });

  // remove the list
  await List.deleteOne({ _id: id, ownerEmail: email });

  res.json({ ok: true, id });
}