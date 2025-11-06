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

export async function createList(name) {
  return jpost("/api/lists", { name });
}

export async function removeList(listId) {
  return jdel(`/api/lists/${listId}`);
}