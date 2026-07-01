// src/hooks/usePixelArt.js
import { useState, useCallback } from 'react';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#8800ff', '#888888', '#553322',
  '#ff6688', '#88ff66', '#6688ff', '#ffcc00',
];

export function usePixelArt(initialSize = 16) {
  const [gridSize, setGridSize] = useState(initialSize);
  const [grid, setGrid] = useState(() => 
    Array.from({ length: initialSize }, () => 
      Array(initialSize).fill('#ffffff')
    )
  );
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);

  const cellSize = Math.floor(480 / gridSize);

  // Flood fill - iterative stack
  const floodFill = useCallback((row, col, newColor) => {
    const targetColor = grid[row][col];
    if (targetColor === newColor) return;

    const newGrid = grid.map(row => [...row]);
    const stack = [[row, col]];

    while (stack.length > 0) {
      const [r, c] = stack.pop();
      if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
      if (newGrid[r][c] !== targetColor) continue;

      newGrid[r][c] = newColor;
      stack.push([r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]);
    }

    setGrid(newGrid);
  }, [grid, gridSize]);

  // Paint single cell
  const paintCell = useCallback((row, col) => {
    const newGrid = grid.map(row => [...row]);
    if (currentTool === 'pen') {
      newGrid[row][col] = currentColor;
    } else if (currentTool === 'eraser') {
      newGrid[row][col] = '#ffffff';
    }
    setGrid(newGrid);
  }, [grid, currentTool, currentColor]);

  // Reset grid when size changes
  const resetGrid = useCallback((newSize) => {
    setGridSize(newSize);
    setGrid(Array.from({ length: newSize }, () => 
      Array(newSize).fill('#ffffff')
    ));
  }, []);

  return {
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
  };
}