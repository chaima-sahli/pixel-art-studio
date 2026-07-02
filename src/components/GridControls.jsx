import { useState } from 'react';
import { Modal } from './Modal';

export function GridControls({ gridSize, resetGrid }) {
  const [showModal, setShowModal] = useState(false);
  const [pendingSize, setPendingSize] = useState(gridSize);

  const handleGridChange = (e) => {
    const newSize = Number(e.target.value);
    setPendingSize(newSize);
    setShowModal(true);
    // Reset select to current value so it doesn't change until confirmed
    e.target.value = gridSize;
  };

  const handleConfirm = () => {
    resetGrid(pendingSize);
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="grid-controls">
        <label>📐 GRID SIZE</label>
        <select
          className="grid-select"
          value={gridSize}
          onChange={handleGridChange}
        >
          <option value="16">16 × 16</option>
          <option value="32">32 × 32</option>
          <option value="64">64 × 64</option>
        </select>
      </div>

      <Modal
        isOpen={showModal}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
        title="⚠️ GRID RESIZE"
        message={
          <>
            Changing grid size will <span className="highlight">clear your canvas</span>.<br />
            All current pixels will be lost.<br /><br />
            <span style={{ fontSize: '8px', color: '#8394FE' }}>
              Continue to {pendingSize} × {pendingSize}?
            </span>
          </>
        }
      />
    </>
  );
}