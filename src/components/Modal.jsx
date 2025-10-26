export default function Modal({ open, onClose, children, title }){
    if (!open) return null;
  
    const onBackdrop = (e) => {
      // close only if clicked outside the panel
      if (e.target.classList.contains('modal-backdrop')) onClose?.();
    };
  
    return (
      <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label={title} onClick={onBackdrop}>
        <div className="modal-panel">
          <div className="modal-header">
            <div className="modal-title">{title}</div>
            <button className="btn btn-ghost" onClick={onClose} aria-label="Close">✕</button>
          </div>
          {children}
        </div>
      </div>
    );
}  