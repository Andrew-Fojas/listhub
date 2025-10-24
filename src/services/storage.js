const KEY = "listhub";

export function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || null; }
  catch { return null; }
}
export function save(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}