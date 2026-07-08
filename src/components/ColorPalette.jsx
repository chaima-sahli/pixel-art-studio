import { useSound } from '../hooks/useSound';

export function ColorPalette({ 
  colors, 
  currentColor, 
  setCurrentColor,
  colorHistory = [],
  maxHistory = 8  // ← ADD with default
}) {
  const { playSound } = useSound();

  const handleColorSelect = (color) => {
    setCurrentColor(color);
    playSound('click');
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCurrentColor(color);
  };

  const handleCustomColorClick = () => {
    playSound('click');
  };

  const hasHistory = colorHistory.length > 0;

  return (
    <div className="color-section">
      <span className="color-section-label">🎨 PALETTE</span>
      
      {/* ===== PRESET COLORS (8) ===== */}
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

      {/* ===== COLOR HISTORY (8) ===== */}
      {hasHistory && (
        <>
          <div className="history-divider"></div>
          <span className="history-label">📋 RECENT</span>
          <div className="color-grid history-grid">
            {colorHistory.map((color) => (
              <div
                key={color}
                className={`color-swatch history-swatch ${currentColor === color ? 'active' : ''}`}
                onClick={() => handleColorSelect(color)}
                style={{ backgroundColor: color }}
                title={`Recent: ${color}`}
              />
            ))}
            {/* Fill remaining empty slots with placeholders */}
            {Array.from({ length: maxHistory - colorHistory.length }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="color-swatch history-swatch empty"
                style={{
                  backgroundColor: 'transparent',
                  border: '2px dashed rgba(131, 148, 254, 0.2)',
                  cursor: 'default',
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* ===== CUSTOM COLOR ===== */}
      <div className="custom-color-row">
        <span className="custom-color-label">CUSTOM</span>
        
        <input
          type="color"
          className="custom-color-input"
          value={currentColor}
          onChange={handleCustomColorChange}
          onClick={handleCustomColorClick}
          style={{
            width: '32px',
            height: '32px',
            border: `3px solid ${colors.includes(currentColor) || colorHistory.includes(currentColor) ? '#8394FE' : '#FEFCFF'}`,
            borderRadius: '6px',
            cursor: 'pointer',
            background: 'transparent',
            padding: '2px',
            position: 'relative',
            display: 'inline-block',
          }}
        />
        
        <span 
          className="custom-color-hex"
          style={{
            backgroundColor: currentColor,
            color: isLightColor(currentColor) ? '#000000' : '#FFFFFF',
            border: '2px solid #8394FE',
            padding: '4px 10px',
            borderRadius: '4px',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '7px',
            letterSpacing: '1px',
            transition: 'all 0.2s ease',
          }}
        >
          {currentColor.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

// Helper function to determine if color is light or dark
function isLightColor(hex) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}