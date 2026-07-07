import { useState, useRef, useEffect } from 'react';
import { usePixelArt } from './hooks/usePixelArt';
import { useSound } from './hooks/useSound';
import { Canvas } from './components/Canvas';
import { Toolbar } from './components/Toolbar';
import { ColorPalette } from './components/ColorPalette';
import { GridControls } from './components/GridControls';
import { UndoRedoButtons } from './components/UndoRedoButtons';
import { exportGIF } from './utils/gifExporter'; 
import './App.css';

function App() {
  const { playSound } = useSound();
  const [saveStatus, setSaveStatus] = useState('💾 Saved');
  const saveTimerRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

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
    undo,
    redo,
    canUndo,
    canRedo,
    initialize,
    startStroke,
    endStroke,
    clearCanvas,
  } = usePixelArt(16);

  // Initialize history after first render
  useEffect(() => {
    initialize();
  }, [initialize]);

  const prevGridRef = useRef(grid);
  useEffect(() => {
    if (prevGridRef.current !== grid) {
      const timeoutId = setTimeout(() => {
        setSaveStatus('💾 Saving...');
        saveTimerRef.current = setTimeout(() => {
          setSaveStatus('💾 Saved');
        }, 500);
      }, 0);

      prevGridRef.current = grid;
      
      return () => {
        clearTimeout(timeoutId);
        clearTimeout(saveTimerRef.current);
      };
    }
  }, [grid]);

  // ===== EXPORT PNG =====
  const handleExport = () => {
    playSound('success');

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

  // ===== EXPORT GIF =====
  const handleExportGif = async () => {
    if (frames.length < 2) {
      playSound('error');
      alert('You need at least 2 frames to export as GIF!');
      return;
    }

    if (isExporting) return;

    setIsExporting(true);
    setSaveStatus('🎬 Generating GIF...');
    playSound('success');

    try {
      // Get all frames (make sure they're in the right format)
      const framesData = frames.map(frame => [...frame]);
      
      // Export as GIF with 300ms delay per frame
      const blob = await exportGIF(framesData, gridSize, 300);
      
      // Download the GIF
      const link = document.createElement('a');
      link.download = 'pixel-art.gif';
      link.href = URL.createObjectURL(blob);
      link.click();
      
      // Clean up
      URL.revokeObjectURL(link.href);
      
      setSaveStatus('💾 GIF Exported!');
      playSound('success');
      
      setTimeout(() => {
        setSaveStatus('💾 Saved');
      }, 2000);
    } catch (error) {
      console.error('Failed to export GIF:', error);
      setSaveStatus('💾 Error exporting GIF');
      playSound('error');
    } finally {
      setIsExporting(false);
    }
  };

  // ===== KEYBOARD SHORTCUTS =====
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setCurrentTool('pen');
        playSound('click');
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        setCurrentTool('eraser');
        playSound('click');
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setCurrentTool('fill');
        playSound('click');
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          undo();
          playSound('click');
        }
      }

      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'y' || (e.shiftKey && e.key === 'z'))
      ) {
        e.preventDefault();
        if (canRedo) {
          redo();
          playSound('click');
        }
      }

      const num = parseInt(e.key);
      if (num >= 1 && num <= 8 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setCurrentColor(PRESET_COLORS[num - 1]);
        playSound('click');
      }
      if (e.shiftKey && !e.ctrlKey && !e.metaKey) {
        const shiftNum = parseInt(e.key);
        if (shiftNum >= 1 && shiftNum <= 8) {
          e.preventDefault();
          setCurrentColor(PRESET_COLORS[shiftNum + 7]);
          playSound('click');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setCurrentTool,
    setCurrentColor,
    PRESET_COLORS,
    playSound,
    undo,
    redo,
    canUndo,
    canRedo,
  ]);

  useEffect(() => {
    return () => cleanup();
  }, [cleanup]);

  return (
    <div className='app'>
      <div className='corner-glow tl'></div>
      <div className='corner-glow tr'></div>
      <div className='corner-glow bl'></div>
      <div className='corner-glow br'></div>

      <div className='sidebar'>
        <div className='menu-title'>
          PIXEL STUDIO
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

          <div className='frame-controls'>
            <button
              className='frame-btn save-btn'
              onClick={() => {
                saveFrame();
                playSound('frame-save');
              }}
              title='Save current frame'
            >
              ➕
            </button>

            <span className='frame-counter'>
              {frames.length > 0
                ? `${currentFrameIndex + 1}/${frames.length}`
                : '📭 Empty'}
            </span>

            <button
              className='frame-btn'
              onClick={() => {
                loadFrame(currentFrameIndex - 1);
                playSound('click');
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
                playSound('click');
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
                playSound('error');
              }}
              disabled={frames.length === 0}
              title='Delete current frame'
            >
              🗑
            </button>
          </div>

          <div className='animation-play-controls'>
            {isAnimating ? (
              <button
                className='play-btn stop'
                onClick={() => {
                  stopAnimation();
                  playSound('click');
                }}
              >
                ⏹ STOP
              </button>
            ) : (
              <button
                className={`play-btn play ${frames.length < 2 ? 'disabled' : ''}`}
                onClick={() => {
                  playAnimation();
                  playSound('success');
                }}
                disabled={frames.length < 2}
              >
                {frames.length < 2
                  ? '⏸ NEED 2+ FRAMES'
                  : `▶ PLAY (${frames.length} frames)`}
              </button>
            )}

            <button
              className='frame-btn clear-btn'
              onClick={() => {
                clearFrames();
                playSound('error');
              }}
              disabled={frames.length === 0}
              title='Clear all frames'
            >
              ✖ CLEAR
            </button>
          </div>

          {frames.length === 0 && (
            <div className='frame-helper'>
              💡 Draw something, then click ➕ to save as a frame
            </div>
          )}
        </div>

        <GridControls gridSize={gridSize} resetGrid={resetGrid} />

        {/* ===== EXPORT SECTION ===== */}
        <div className='export-section'>
          <button className='export-btn' onClick={handleExport}>
            ⬇ DOWNLOAD PNG
          </button>
          <button
            className={`export-btn gif-btn ${frames.length < 2 ? 'disabled' : ''}`}
            onClick={handleExportGif}
            disabled={frames.length < 2 || isExporting}
            title={
              frames.length < 2 
                ? 'Need at least 2 frames' 
                : isExporting 
                ? 'Generating...' 
                : 'Export as animated GIF'
            }
          >
            {isExporting ? '⏳ GENERATING...' : '🎬 EXPORT GIF'}
          </button>
          {/* {frames.length < 2 && !isExporting && (
            <span className='gif-hint'>Need 2+ frames</span>
          )} */}
        </div>
      </div>

      <div className='canvas-container'>
        <UndoRedoButtons
          onUndo={undo}
          onRedo={redo}
          canUndo={canUndo}
          canRedo={canRedo}
          onClear={clearCanvas}
          saveStatus={saveStatus}
        />

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
          startStroke={startStroke}
          endStroke={endStroke}
        />
      </div>
    </div>
  );
}

export default App;