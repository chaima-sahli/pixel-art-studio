// src/App.jsx
import { useEffect } from "react";
import { usePixelArt } from "./hooks/usePixelArt";
import { Canvas } from "./components/Canvas";
import { Toolbar } from "./components/Toolbar";
import { ColorPalette } from "./components/ColorPalette";
import "./App.css";

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
    // Animation
    frames,
    currentFrameIndex,
    isAnimating,
    saveFrame,
    loadFrame,
    deleteFrame,
    clearFrames,
    playAnimation,
    stopAnimation,
    cleanup,
  } = usePixelArt(16);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Tool shortcuts
      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        setCurrentTool("pen");
      } else if (e.key === "e" || e.key === "E") {
        e.preventDefault();
        setCurrentTool("eraser");
      } else if (e.key === "f" || e.key === "F") {
        e.preventDefault();
        setCurrentTool("fill");
      }

      // Number shortcuts for colors
      const num = parseInt(e.key);
      if (num >= 1 && num <= 8) {
        e.preventDefault();
        setCurrentColor(PRESET_COLORS[num - 1]);
      }
      if (e.shiftKey) {
        const shiftNum = parseInt(e.key);
        if (shiftNum >= 1 && shiftNum <= 8) {
          e.preventDefault();
          setCurrentColor(PRESET_COLORS[shiftNum + 7]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setCurrentTool, setCurrentColor, PRESET_COLORS]);

  // Cleanup animation on unmount
  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  const handleExport = () => {
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");
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
          exportCellSize,
        );
      }
    }

    const link = document.createElement("a");
    link.download = "pixel-art.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className='app'>
      <div className='corner-glow tl'></div>
      <div className='corner-glow tr'></div>
      <div className='corner-glow bl'></div>
      <div className='corner-glow br'></div>
      <div className='sidebar'>
        <div className='sidebar-title'>
          🎨 PIXEL STUDIO
          <span>ART MAKER v1.0</span>
        </div>

        <Toolbar currentTool={currentTool} setCurrentTool={setCurrentTool} />

        <ColorPalette
          colors={PRESET_COLORS}
          currentColor={currentColor}
          setCurrentColor={setCurrentColor}
        />

        {/* ===== ANIMATION CONTROLS ===== */}
        <div className='animation-section'>
          <span className='animation-label'>🎬 FRAMES</span>

          {/* Frame counter and navigation */}
          <div className='frame-controls'>
            <button
              className='frame-btn save-btn'
              onClick={() => {
                saveFrame();
                // playSound("success");
              }}
              title='Save current frame'
            >
              ➕
            </button>

            <span className='frame-counter'>
              {frames.length > 0
                ? `${currentFrameIndex + 1}/${frames.length}`
                : "📭 Empty"}
            </span>

            <button
              className='frame-btn'
              onClick={() => {
                loadFrame(currentFrameIndex - 1);
                // playSound("click");
              }}
              disabled={currentFrameIndex <= 0 || frames.length === 0}
              title='Previous frame'
            >
              ◀
            </button>

            <button
              className='frame-btn'
              onClick={() => {
                loadFrame(currentFrameIndex + 1);
                // playSound("click");
              }}
              disabled={
                currentFrameIndex >= frames.length - 1 || frames.length === 0
              }
              title='Next frame'
            >
              ▶
            </button>

            <button
              className='frame-btn delete-btn'
              onClick={() => {
                deleteFrame();
                // playSound("error");
              }}
              disabled={frames.length === 0}
              title='Delete current frame'
            >
              🗑
            </button>
          </div>

          {/* Play / Stop controls */}
          <div className='animation-play-controls'>
            {isAnimating ? (
              <button className='play-btn stop' onClick={stopAnimation}>
                ⏹ STOP
              </button>
            ) : (
              <button
                className={`play-btn play ${frames.length < 2 ? "disabled" : ""}`}
                onClick={() => {
                  playAnimation();
                  // playSound("success");
                }}
                disabled={frames.length < 2}
              >
                {frames.length < 2
                  ? "⏸ NEED 2+ FRAMES"
                  : `▶ PLAY (${frames.length} frames)`}
              </button>
            )}

            <button
              className='frame-btn clear-btn'
              onClick={() => {
                clearFrames();
                // playSound("error");
              }}
              disabled={frames.length === 0}
              title='Clear all frames'
            >
              ✖ CLEAR
            </button>
          </div>

          {/* Helper text when no frames */}
          {frames.length === 0 && (
            <div className='frame-helper'>
              💡 Draw something, then click ➕ to save as a frame
            </div>
          )}
        </div>

        <div className='grid-controls'>
          <label>📐 GRID SIZE</label>
          <select
            className='grid-select'
            value={gridSize}
            onChange={(e) => {
              if (
                confirm("Changing grid size will clear your canvas. Continue?")
              ) {
                resetGrid(Number(e.target.value));
              }
            }}
          >
            <option value='16'>16 × 16</option>
            <option value='32'>32 × 32</option>
            <option value='64'>64 × 64</option>
          </select>
        </div>

        <button className='export-btn' onClick={handleExport}>
          ⬇ DOWNLOAD PNG
        </button>
      </div>

      <div className='canvas-container'>
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
