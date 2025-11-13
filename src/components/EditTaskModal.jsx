import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

export default function EditTaskModal({ open, onClose, task, onSave }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [emailReminder, setEmailReminder] = useState(false);
  const [error, setError] = useState("");
  const [canToggleReminder, setCanToggleReminder] = useState(true);

  // Prefill whenever modal opens or the selected task changes
  useEffect(() => {
    if (open && task) {
      setTitle(task.title ?? "");
      setDesc(task.desc ?? "");
      setDate(task.date ?? "");
      setTime(task.time ?? "");
      setEmailReminder(task.emailReminder ?? false);
      setError("");

      // Check if task is still more than 10 minutes away
      if (task.date && task.time) {
        const [year, month, day] = task.date.split("-");
        const [hours, minutes] = task.time.split(":");
        const taskDateTime = new Date(year, month - 1, day, hours, minutes);
        const now = new Date();
        const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);
        setCanToggleReminder(taskDateTime > tenMinutesFromNow);
      }
    }
  }, [open, task?.id]); // depend on task id

  const submit = (e) => {
    e.preventDefault();
    setError("");

    const t = title.trim();
    if (!t) return;

    // Validate email reminder requirements
    if (emailReminder && !task.emailReminder) {
      // User is trying to enable email reminder
      if (!date || !time) {
        setError("The Date and Time must be filled in to send an email reminder");
        return;
      }

      // Check if task is scheduled at least 10 minutes in the future
      const [year, month, day] = date.split("-");
      const [hours, minutes] = time.split(":");
      const taskDateTime = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();
      const tenMinutesFromNow = new Date(now.getTime() + 10 * 60 * 1000);

      if (taskDateTime <= tenMinutesFromNow) {
        setError("The task must be scheduled 10 minutes in advance of the present moment");
        return;
      }
    }

    // Validate unchecking email reminder
    if (!emailReminder && task.emailReminder) {
      if (!canToggleReminder) {
        setError("The task reminder has already been sent out");
        return;
      }
    }

    onSave?.(t, desc, date, time, emailReminder);
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
        <label className="modal-form-label" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem'}}>
          <input
            type="checkbox"
            checked={emailReminder}
            onChange={(e)=>setEmailReminder(e.target.checked)}
            disabled={task.emailReminder && !canToggleReminder}
            style={{width: 'auto', margin: 0}}
          />
          <span>Send an email reminder about the task 10 minutes before it is scheduled?</span>
        </label>
        {error && <div style={{color: 'red', fontSize: '0.9em', marginTop: '0.5rem'}}>{error}</div>}
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