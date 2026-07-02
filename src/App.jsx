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

  // Export PNG
  const handleExport = () => {
    const exportCanvas = document.createElement('canvas');
    const exportCtx = exportCanvas.getContext('2d');
    const exportCellSize = Math.max(16, Math.floor(512 / gridSize));
    exportCanvas.width = gridSize * exportCellSize;
    exportCanvas.height = gridSize * exportCellSize;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        exportCtx.fillStyle = grid[row][col];
        exportCtx.fillRect(col * exportCellSize, row * exportCellSize, exportCellSize, exportCellSize);
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
        <h1 style={{ color: '#fff', fontSize: '20px', marginBottom: '20px' }}>
          🎨 Pixel Studio
        </h1>
        
        <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />
        <ColorPalette 
          colors={PRESET_COLORS} 
          currentColor={currentColor} 
          setCurrentColor={setCurrentColor} 
        />
        
        <div style={{ marginTop: '20px' }}>
          <label style={{ color: '#aaa', fontSize: '14px', display: 'block', marginBottom: '8px' }}>
            Grid Size
          </label>
          <select
            value={gridSize}
            onChange={(e) => {
              if (confirm('Changing grid size will clear your canvas. Continue?')) {
                resetGrid(Number(e.target.value));
              }
            }}
            style={{
              padding: '8px 12px',
              background: '#222',
              color: '#fff',
              border: '1px solid #444',
              borderRadius: '6px',
              width: '100%',
              cursor: 'pointer',
            }}
          >
            <option value="16">16 x 16</option>
            <option value="32">32 x 32</option>
            <option value="64">64 x 64</option>
          </select>
        </div>

        <button
          onClick={handleExport}
          style={{
            marginTop: '20px',
            padding: '10px 16px',
            background: '#2a7a2a',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            width: '100%',
          }}
        >
          ⬇️ Download PNG
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