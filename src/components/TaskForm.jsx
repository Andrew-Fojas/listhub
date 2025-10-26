import { useState } from "react";

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const submit = (e)=>{
    e.preventDefault();
    const t = title.trim();
    if(!t) return;
    onAdd(t, desc.trim());
    setTitle(""); setDesc("");
  };

  return (
    <form onSubmit={submit} style={{display:'grid', gap:'.5rem'}}>
      <input
        placeholder="Task title"
        value={title}
        onChange={e=>setTitle(e.target.value)}
        style={{padding:'.75rem', borderRadius:'12px', border:'1px solid #e6d5c0'}}
      />
      <input
        placeholder="Description (optional)"
        value={desc}
        onChange={e=>setDesc(e.target.value)}
        style={{padding:'.75rem', borderRadius:'12px', border:'1px solid #e6d5c0'}}
      />
      <button className="btn btn-primary" type="submit">Add Task</button>
    </form>
  );
}