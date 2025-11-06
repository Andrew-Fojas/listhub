// src/services/lists.service.js
import { jget, jpost, jpatch, jdel } from "./http.js";

const USE_API = true;

// GET ALL LISTS
export async function getLists() {
  const data = await jget("/api/lists");
  // normalize every list so list.tasks is ALWAYS an array
  return data.map((l) => ({
    ...l,
    tasks: Array.isArray(l.tasks) ? l.tasks : [],
  }));
}

// GET ONE LIST
export async function getListById(id) {
  const data = await jget(`/api/lists/${id}`);
  return {
    ...data,
    tasks: Array.isArray(data.tasks) ? data.tasks : [],
  };
}

// ADD TASK
export async function addTask(listId, title, desc = "") {
  return jpost(`/api/lists/${listId}/tasks`, { title, desc });
}

// TOGGLE TASK
export async function toggleTask(taskId) {
  return jpatch(`/api/tasks/${taskId}/toggle`);
}

export async function updateTask(taskId, fields){
  // fields can be { title, desc }
  return jpatch(`/api/tasks/${taskId}`, fields);
}

export async function removeTask(taskId){
  return jdel(`/api/tasks/${taskId}`);
}

/*import { load, save } from "./storage.js";
import { seed } from "../data/seed.js";

function ensureState() {
  let s = load();
  if (!s) { s = seed; save(s); }
  return s;
}

export function getLists() {
  const s = ensureState();
  return s.lists.map(list => ({
    ...list,
    tasks: s.tasks.filter(t => t.listId === list.id)
  }));
}

export function getListById(listId) {
  const s = ensureState();
  const list = s.lists.find(l => l.id === listId);
  const tasks = s.tasks.filter(t => t.listId === listId);
  return list ? { ...list, tasks } : null;
}

export function addTask(listId, title, desc="") {
  const s = ensureState();
  const id = crypto.randomUUID();
  s.tasks.push({ id, listId, title, desc, done: false });
  save(s);
  return id;
}

export function toggleTask(taskId) {
  const s = ensureState();
  const t = s.tasks.find(x => x.id === taskId);
  if (t) { t.done = !t.done; save(s); }
}

export function counts() {
  const s = ensureState();
  const total = s.tasks.length;
  const completed = s.tasks.filter(t => t.done).length;
  const remaining = total - completed;
  const categories = s.lists.length;
  return { total, completed, remaining, categories };
}*/