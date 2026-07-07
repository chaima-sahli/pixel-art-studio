import { useState, useCallback, useRef } from 'react';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
  '#ff8800', '#8800ff', '#888888', '#553322',
  '#ff6688', '#88ff66', '#6688ff', '#ffcc00',
];

export function usePixelArt(initialSize = 16) {
  //  EXISTING STATE 
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
  
  //  UNDO/REDO STATE 
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);
  const isInitialized = useRef(false);

  //  ANIMATION STATE 
  const [frames, setFrames] = useState([]);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const cellSize = Math.floor(480 / gridSize);

  //  SAVE HISTORY 
  const saveHistory = useCallback((newGrid) => {
    if (isUndoRedo.current) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    const gridCopy = newGrid.map(row => [...row]);
    newHistory.push(gridCopy);
    
    // Limit history to 50 steps to prevent memory issues
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  //  UNDO 
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setGrid(history[prevIndex].map(row => [...row]));
      setTimeout(() => {
        isUndoRedo.current = false;
      }, 100);
    }
  }, [history, historyIndex]);

  //  REDO 
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedo.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setGrid(history[nextIndex].map(row => [...row]));
      setTimeout(() => {
        isUndoRedo.current = false;
      }, 100);
    }
  }, [history, historyIndex]);

  //  PAINT CELL 
  const paintCell = useCallback((row, col) => {
    const newGrid = grid.map(row => [...row]);
    if (currentTool === 'pen') {
      newGrid[row][col] = currentColor;
    } else if (currentTool === 'eraser') {
      newGrid[row][col] = '#ffffff';
    }
    setGrid(newGrid);
    saveHistory(newGrid);
  }, [grid, currentTool, currentColor, saveHistory]);

  //  FLOOD FILL 
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
    saveHistory(newGrid);
  }, [grid, gridSize, saveHistory]);

  //  RESET GRID 
  const resetGrid = useCallback((newSize) => {
    const newGrid = Array.from({ length: newSize }, () =>
      Array(newSize).fill('#ffffff')
    );
    setGridSize(newSize);
    setGrid(newGrid);
    // Reset history when grid size changes
    setHistory([newGrid.map(row => [...row])]);
    setHistoryIndex(0);
  }, []);

  //  INITIALIZE HISTORY 
  const initialize = useCallback(() => {
    if (!isInitialized.current) {
      const initialGrid = grid.map(row => [...row]);
      setHistory([initialGrid]);
      setHistoryIndex(0);
      isInitialized.current = true;
    }
  }, [grid]);

  //  ANIMATION FUNCTIONS 
  const saveFrame = useCallback(() => {
    const frameCopy = grid.map(row => [...row]);
    setFrames(prev => [...prev, frameCopy]);
    setCurrentFrameIndex(frames.length);
  }, [grid, frames.length]);

  const loadFrame = useCallback((index) => {
    if (index >= 0 && index < frames.length) {
      const newGrid = frames[index].map(row => [...row]);
      setGrid(newGrid);
      setCurrentFrameIndex(index);
      saveHistory(newGrid);
    }
  }, [frames, saveHistory]);

  const deleteFrame = useCallback((index) => {
    setFrames(prev => prev.filter((_, i) => i !== index));
    if (currentFrameIndex >= frames.length - 1) {
      setCurrentFrameIndex(Math.max(0, frames.length - 2));
    }
  }, [frames.length, currentFrameIndex]);

  const clearFrames = useCallback(() => {
    setFrames([]);
    setCurrentFrameIndex(0);
  }, []);

  const playAnimation = useCallback(() => {
    if (frames.length < 2) return;
    
    setIsAnimating(true);
    let index = 0;
    
    animationRef.current = setInterval(() => {
      index = (index + 1) % frames.length;
      const newGrid = frames[index].map(row => [...row]);
      setGrid(newGrid);
      setCurrentFrameIndex(index);
      // Don't save animation steps to history
    }, 300);
  }, [frames]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
    setIsAnimating(false);
  }, []);

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      clearInterval(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  return {
    // Existing
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
    // Undo/Redo
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    initialize,
  };
}