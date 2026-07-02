import { useEffect } from 'react';
import { usePixelArt } from './hooks/usePixelArt';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ColorPalette } from './components/ColorPalette';
import './App.css';

function App() {
  const {
    grid,
    gridSize,
    cellSize,
    currentColor,
    currentTool,
    isDrawing,
    hoveredCell,
    setCurrentColor,
    setCurrentTool,
    setIsDrawing,
    setHoveredCell,
    paintCell,
    floodFill,
    resetGrid,
    PRESET_COLORS,
  } = usePixelArt(16);
  
  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tool shortcuts
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setCurrentTool('pen');
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setCurrentTool('eraser');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setCurrentTool('fill');
      }
      
      // Number shortcuts for colors (1-8, then shift+1-8 for 9-16)
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        e.preventDefault();
        setCurrentColor(PRESET_COLORS[num - 1]);
      }
      // Shift + number for colors 9-16
      if (e.shiftKey) {
        const shiftNum = parseInt(e.key);
        if (shiftNum >= 1 && shiftNum <= 8) {
          e.preventDefault();
          setCurrentColor(PRESET_COLORS[shiftNum + 7]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCurrentTool, setCurrentColor, PRESET_COLORS]);



  const handleExport = () => {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const exportCellSize = Math.max(16, Math.floor(512 / gridSize));
    exportCanvas.width = gridSize * exportCellSize;
    exportCanvas.height = gridSize * exportCellSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        exportCtx.fillStyle = grid[row][col];
        exportCtx.fillRect(
          col * exportCellSize,
          row * exportCellSize,
          exportCellSize,
          exportCellSize
        );
      }
    }

    const link = document.createElement('a');
    link.download = 'pixel-art.png';
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-title">
          🎨 PIXEL STUDIO
          <span>ART MAKER v1.0</span>
        </div>

        <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
        
        <ColorPalette
          colors={PRESET_COLORS}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />

        <div className="grid-controls">
          <label>📐 GRID SIZE</label>
          <select
            className="grid-select"
            value={gridSize}
            onChange={(e) => {
              if (confirm('Changing grid size will clear your canvas. Continue?')) {
                resetGrid(Number(e.target.value));
              }
            }}
          >
            <option value="16">16 × 16</option>
            <option value="32">32 × 32</option>
            <option value="64">64 × 64</option>
          </select>
        </div>

        <button className="export-btn" onClick={handleExport}>
          ⬇ DOWNLOAD PNG
        </button>
      </div>

      <div className="canvas-container">
        <Canvas
          grid={grid}
          gridSize={gridSize}
          cellSize={cellSize}
          currentColor={currentColor}
          currentTool={currentTool}
          isDrawing={isDrawing}
          setIsDrawing={setIsDrawing}
          hoveredCell={hoveredCell}
          setHoveredCell={setHoveredCell}
          paintCell={paintCell}
          floodFill={floodFill}
        />
      </div>
    </div>
  );
}

export default App;