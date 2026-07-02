import { useEffect } from 'react';

export function Modal({ isOpen, onConfirm, onCancel, title, message }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Modal title bar - like a game window */}
        <div className="modal-title-bar">
          <span className="modal-title-icon">◆</span>
          <span className="modal-title">{title}</span>
          <button className="modal-close-btn" onClick={onCancel}>✕</button>
        </div>
        
        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>
        
        <div className="modal-footer">
          <button className="modal-btn modal-btn-cancel" onClick={onCancel}>
            CANCEL
          </button>
          <button className="modal-btn modal-btn-confirm" onClick={onConfirm}>
            ✓ CONTINUE
          </button>
        </div>
      </div>
    </div>
  );
}