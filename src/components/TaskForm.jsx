import { useState } from "react";
export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), desc.trim());
    setTitle(""); setDesc("");
  };
  return (
    <form onSubmit={submit}>
      <input placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button type="submit">Add Task</button>
    </form>
  );
}