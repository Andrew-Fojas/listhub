import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  // Prefill whenever modal opens or the selected task changes
  useEffect(() => {
    if (open && task) {
      setTitle(task.title ?? "");
      setDesc(task.desc ?? "");
      setDate(task.date ?? "");
      setTime(task.time ?? "");
    }
  }, [open, task?.id]); // depend on task id

  const submit = (e) => {
    e.preventDefault();
    const t = title.trim();
    if (!t) return;
    onSave?.(t, desc, date, time);
  };

  // Don't render at all without a task
  if (!open || !task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Edit Task">
      <form className="modal-form" onSubmit={submit} key={task.id}>
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <label className="modal-form-label">
          Date (optional)
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label className="modal-form-label">
          Time (optional)
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </label>
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary">
            Save Changes
          </button>
        </div>
      </form>
    </Modal>
  );
}