import { useState } from 'react';
import { useSound } from '../hooks/useSound';

export function ColorPalette({ colors, currentColor, setCurrentColor }) {
  const [customColor, setCustomColor] = useState('#000000');
  const { playSound } = useSound();

  const handleColorSelect = (color) => {
    setCurrentColor(color);
    setCustomColor(color);
    playSound('click');
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    setCurrentColor(color);
    playSound('click'); 
  };

  return (
    <div className="color-section">
      <span className="color-section-label">🎨 PALETTE</span>
      
      <div className="color-grid">
        {colors.map((color) => (
          <div
            key={color}
            className={`color-swatch ${currentColor === color ? 'active' : ''}`}
            onClick={() => handleColorSelect(color)}
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>

      <div className="custom-color-row">
        <span className="custom-color-label">CUSTOM</span>
        <input
          type="color"
          className="custom-color-input"
          value={customColor}
          onChange={handleCustomColorChange}
        />
        <span className="custom-color-hex">{customColor.toUpperCase()}</span>
      </div>
    </div>
  );
}