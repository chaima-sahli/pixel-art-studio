// src/components/Canvas.jsx
import { useRef, useEffect } from 'react';
import { useSound } from '../hooks/useSound';

export function Canvas({ 
  grid, 
  gridSize, 
  cellSize, 
  currentColor, 
  currentTool,
  isDrawing, 
  setIsDrawing, 
  hoveredCell, 
  setHoveredCell,
  paintCell,
  floodFill,
  startStroke,
  endStroke,
  eyedropper,
  onColorUsed,
  previewMode,
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const { playSound } = useSound();

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
  }, [gridSize, cellSize]);

  // Render function
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        // Draw pixel
        ctx.fillStyle = grid[row][col];
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

        // Only draw grid lines if NOT in preview mode
        if (!previewMode) {
          ctx.strokeStyle = '#333333';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Hover preview - only show in preview mode if not drawing
    if (hoveredCell && !isDrawing) {
      const { row, col } = hoveredCell;
      let previewColor = currentTool === 'eraser' ? '#ffffff' : currentColor;
      
      if (currentTool === 'eyedropper') {
        previewColor = grid[row]?.[col] || '#ffffff';
      }
      
      ctx.fillStyle = previewColor;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.globalAlpha = 1.0;
    }
  }, [grid, gridSize, cellSize, currentColor, currentTool, isDrawing, hoveredCell, previewMode]);

  // Get cell from mouse position
  const getCellFromMouse = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const col = Math.floor(x / cellSize);
    const row = Math.floor(y / cellSize);
    if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
      return { row, col };
    }
    return null;
  };

  const hasPlayedSound = useRef(false);

  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const cell = getCellFromMouse(e);
    if (cell) {
      // EYEDROPPER
      if (currentTool === 'eyedropper') {
        const color = eyedropper(cell.row, cell.col);
        if (color) {
          playSound('click');
        }
        setIsDrawing(false);
        return;
      }
      
      // FLOOD FILL
      if (currentTool === 'fill') {
        floodFill(cell.row, cell.col, currentColor);
        playSound('fill');
        return;
      }
      
      // PEN / ERASER
      startStroke();
      paintCell(cell.row, cell.col);
      // ✅ Add color to history when drawing
      if (onColorUsed) {
        onColorUsed(currentColor);
      }
      if (!hasPlayedSound.current) {
        playSound('paint');
        hasPlayedSound.current = true;
      }
    }
  };

  const handleMouseMove = (e) => {
    const cell = getCellFromMouse(e);
    setHoveredCell(cell);
    
    if (isDrawing && currentTool !== 'fill' && currentTool !== 'eyedropper' && cell) {
      paintCell(cell.row, cell.col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    if (currentTool !== 'fill' && currentTool !== 'eyedropper') {
      endStroke();
    }
    hasPlayedSound.current = false;
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setHoveredCell(null);
    if (currentTool !== 'fill' && currentTool !== 'eyedropper') {
      endStroke();
    }
    hasPlayedSound.current = false;
  };

  return (
    <canvas
      ref={canvasRef}
      id="pixel-canvas"
      className="pixel-canvas"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'block',
        cursor: currentTool === 'eyedropper' ? 'crosshair' : 'crosshair',
        backgroundColor: '#1a1a2e',
        borderRadius: '4px',
        width: '100%',
        height: 'auto',
        maxWidth: '520px',
        aspectRatio: '1 / 1',
      }}
    />
  );
}