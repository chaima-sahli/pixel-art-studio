import { useSound } from '../hooks/useSound';

export function UndoRedoButtons({ onUndo, onRedo, canUndo, canRedo }) {
  const { playSound } = useSound();

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

  return (
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
    </div>
  );
}