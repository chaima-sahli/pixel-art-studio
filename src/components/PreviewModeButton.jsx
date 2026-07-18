import { useSound } from '../hooks/useSound';

export function PreviewModeButton({ previewMode, togglePreviewMode }) {
  const { playSound } = useSound();

  const handleToggle = () => {
    togglePreviewMode();
    playSound('click');
  };

  return (
    <button
      className={`preview-btn ${previewMode ? 'active' : ''}`}
      onClick={handleToggle}
      title={previewMode ? 'Exit Preview Mode' : 'Enter Preview Mode'}
    >
      <span className="preview-icon">{previewMode ? '👁️' : '👁️‍🗨️'}</span>
      <span className="preview-label">{previewMode ? 'EXIT PREVIEW' : 'PREVIEW'}</span>
    </button>
  );
}