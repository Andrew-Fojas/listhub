import { useState } from "react";
import Modal from "./Modal.jsx";

export default function AddTaskModal({ open, onClose, onCreate }){
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onCreate?.(t, desc.trim(), date, time);
    setTitle(""); setDesc(""); setDate(""); setTime("");
    onClose?.();
  };

  return (
    <Modal open={open} onClose={onClose} title="Create Task">
      <form className="modal-form" onSubmit={submit}>
        <input
          placeholder="Add a new task..."
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />
        <textarea
          placeholder="Add a description (optional)..."
          value={desc}
          onChange={(e)=>setDesc(e.target.value)}
        />
        <label className="modal-form-label">
          Date (optional)
          <input
            type="date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
          />
        </label>
        <label className="modal-form-label">
          Time (optional)
          <input
            type="time"
            value={time}
            onChange={(e)=>setTime(e.target.value)}
          />
        </label>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Create Task</button>
        </div>
      </form>
    </Modal>
  );
}