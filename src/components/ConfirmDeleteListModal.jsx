import Modal from "./Modal.jsx";

export default function ConfirmDeleteListModal({ open, onClose, list, onConfirm }) {
  if (!open || !list) return null;

  return (
    <Modal open={open} onClose={onClose} title="Delete List">
      <div className="modal-form">
        <p style={{ marginBottom: 10 }}>
          <strong>Do you want to delete the following list?</strong>
        </p>

        <div className="confirm-task-chip">{list.name || "(unnamed list)"}</div>

        <div className="modal-footer">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={() => onConfirm?.()}>
            Delete List
          </button>
        </div>
      </div>
    </Modal>
  );
}