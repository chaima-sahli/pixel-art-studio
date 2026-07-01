import { useRef, useEffect } from 'react';

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
  floodFill 
}) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  // Initialize canvas context
  useEffect(() => {
    const canvas = canvasRef.current;
    ctxRef.current = canvas.getContext('2d');
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
  }, [gridSize, cellSize]);

  // Render function (replaces vanilla render())
  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw grid
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        ctx.fillStyle = grid[row][col];
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);

        ctx.strokeStyle = '#333333';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
      }
    }

    // Hover preview
    if (hoveredCell && !isDrawing) {
      const { row, col } = hoveredCell;
      const previewColor = currentTool === 'eraser' ? '#ffffff' : currentColor;
      ctx.fillStyle = previewColor;
      ctx.globalAlpha = 0.4;
      ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
      ctx.globalAlpha = 1.0;
    }
  }, [grid, gridSize, cellSize, currentColor, currentTool, isDrawing, hoveredCell]);

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

  // Mouse handlers
  const handleMouseDown = (e) => {
    setIsDrawing(true);
    const cell = getCellFromMouse(e);
    if (cell) {
      if (currentTool === 'fill') {
        floodFill(cell.row, cell.col, currentColor);
      } else {
        paintCell(cell.row, cell.col);
      }
    }
  };

  const handleMouseMove = (e) => {
    const cell = getCellFromMouse(e);
    setHoveredCell(cell);
    if (isDrawing && currentTool !== 'fill' && cell) {
      paintCell(cell.row, cell.col);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
    setHoveredCell(null);
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      style={{
        display: 'block',
        cursor: 'crosshair',
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
      }}
    />
  );
}