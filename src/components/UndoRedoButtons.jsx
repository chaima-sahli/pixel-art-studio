import { useState } from 'react';
import { useSound } from '../hooks/useSound';
import { Modal } from './Modal';

export function UndoRedoButtons({ 
  onUndo, 
  onRedo, 
  canUndo, 
  canRedo,
  onClear,
  saveStatus,   
}) {
  const { playSound } = useSound();
  const [showModal, setShowModal] = useState(false);

  const handleUndo = () => {
    if (canUndo) {
      onUndo();
      playSound('click');
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      onRedo();
      playSound('click');
    }
  };

  const handleClearClick = () => {
    playSound('click');
    setShowModal(true);
  };

  const handleClearConfirm = () => {
    onClear();
    playSound('success');
    setShowModal(false);
  };

  const handleClearCancel = () => {
    playSound('click');
    setShowModal(false);
  };

  return (
    <>
      <div className="undo-redo-container">
        <button
          className={`undo-redo-btn undo-btn ${!canUndo ? 'disabled' : ''}`}
          onClick={handleUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          <span className="undo-redo-icon">↩</span>
          <span className="undo-redo-label">UNDO</span>
        </button>
        
        <button
          className={`undo-redo-btn redo-btn ${!canRedo ? 'disabled' : ''}`}
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          <span className="undo-redo-icon">↪</span>
          <span className="undo-redo-label">REDO</span>
        </button>

        <div className="undo-redo-divider"></div>
        
        <button
          className="undo-redo-btn clear-btn"
          onClick={handleClearClick}
          title="Clear all pixels"
        >
          <span className="undo-redo-icon">🗑</span>
          <span className="undo-redo-label">CLEAR</span>
        </button>

        {/* ===== SAVE STATUS INDICATOR ===== */}
        <div className="save-status">
          <span className="save-status-icon">💾</span>
          <span className="save-status-text">{saveStatus}</span>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onConfirm={handleClearConfirm}
        onCancel={handleClearCancel}
        title="⚠️ CLEAR CANVAS"
        message={
          <>
            This will <span className="highlight">erase everything</span> on your canvas.<br />
            All pixels will be set to white.<br /><br />
            <span style={{ fontSize: '8px', color: '#8394FE' }}>
              This action cannot be undone!
            </span>
          </>
        }
      />
    </>
  );
}