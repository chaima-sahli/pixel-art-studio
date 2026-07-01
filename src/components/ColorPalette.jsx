// src/components/ColorPalette.jsx
import { useState } from 'react';

export function ColorPalette({ colors, currentColor, setCurrentColor }) {
  const [customColor, setCustomColor] = useState('#000000');

  const handleColorSelect = (color) => {
    setCurrentColor(color);
    setCustomColor(color);
  };

  return (
    <div className="color-palette" style={{ marginTop: '20px' }}>
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(8, 1fr)',
        gap: '4px',
        marginBottom: '12px'
      }}>
        {colors.map((color) => (
          <div
            key={color}
            onClick={() => handleColorSelect(color)}
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: color,
              borderRadius: '4px',
              border: currentColor === color ? '3px solid white' : '1px solid #444',
              cursor: 'pointer',
              boxShadow: currentColor === color ? '0 0 8px rgba(255,255,255,0.3)' : 'none',
            }}
          />
        ))}
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ color: '#aaa', fontSize: '12px' }}>Custom:</label>
        <input
          type="color"
          value={customColor}
          onChange={(e) => {
            setCustomColor(e.target.value);
            setCurrentColor(e.target.value);
          }}
          style={{
            width: '40px',
            height: '40px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            background: 'transparent',
          }}
        />
        <span style={{ color: '#888', fontSize: '12px' }}>{customColor}</span>
      </div>
    </div>
  );
}