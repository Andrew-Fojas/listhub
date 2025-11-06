import Modal from "./Modal.jsx";

export default function ConfirmDeleteModal({ open, onClose, task, onConfirm }) {
  if (!open || !task) return null;

  return (
    <Modal open={open} onClose={onClose} title="Delete Task">
      <div className="modal-form">
        <p style={{ marginBottom: 10 }}>
          <strong>Do you want to delete the following task?</strong>
        </p>

        <div className="confirm-task-chip" aria-label="Task to delete">
          {task.title || "(untitled task)"}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => onConfirm?.()}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
