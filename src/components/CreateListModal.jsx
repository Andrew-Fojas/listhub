import { useEffect, useState } from "react";
import Modal from "./Modal.jsx";

export default function CreateListModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    const n = name.trim();
    if (!n) return;
    onCreate?.(n);
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose} title="Create New List">
      <form className="modal-form" onSubmit={submit}>
        <p style={{ marginBottom: 10 }}><strong>What do you want to name the new list?</strong></p>
        <input
          placeholder="List name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Create List</button>
        </div>
      </form>
    </Modal>
  );
}