import { useState, useCallback, useRef, useEffect } from 'react';

// ===== PRESET COLORS (8) =====
const PRESET_COLORS = [
  '#000000', '#ffffff', '#ff0000', '#00ff00',
  '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
];

// ===== SAVE/LOAD KEYS =====
const STORAGE_KEYS = {
  GRID: 'pixelStudio_grid',
  GRID_SIZE: 'pixelStudio_gridSize',
  FRAMES: 'pixelStudio_frames',
  CURRENT_FRAME: 'pixelStudio_currentFrame',
};

export function usePixelArt(initialSize = 16) {
  // ===== LOAD FROM LOCALSTORAGE OR USE DEFAULTS =====
  const loadSavedData = useCallback(() => {
    try {
      const savedGrid = localStorage.getItem(STORAGE_KEYS.GRID);
      const savedSize = localStorage.getItem(STORAGE_KEYS.GRID_SIZE);
      const savedFrames = localStorage.getItem(STORAGE_KEYS.FRAMES);
      const savedFrameIndex = localStorage.getItem(STORAGE_KEYS.CURRENT_FRAME);

      const size = savedSize ? parseInt(savedSize) : initialSize;
      const grid = savedGrid ? JSON.parse(savedGrid) : 
        Array.from({ length: size }, () => Array(size).fill('#ffffff'));
      
      const frames = savedFrames ? JSON.parse(savedFrames) : [];
      const frameIndex = savedFrameIndex ? parseInt(savedFrameIndex) : 0;

      return { grid, size, frames, frameIndex };
    } catch (error) {
      console.warn('Failed to load saved data:', error);
      return {
        grid: Array.from({ length: initialSize }, () => Array(initialSize).fill('#ffffff')),
        size: initialSize,
        frames: [],
        frameIndex: 0,
      };
    }
  }, [initialSize]);

  const savedData = loadSavedData();

  const MAX_HISTORY = 8;


  // ===== STATE =====
  const [gridSize, setGridSize] = useState(savedData.size);
  const [grid, setGrid] = useState(savedData.grid);
  const [currentColor, setCurrentColor] = useState('#000000');
  const [currentTool, setCurrentTool] = useState('pen');
  const [isDrawing, setIsDrawing] = useState(false);
  const [hoveredCell, setHoveredCell] = useState(null);
  
  // ===== UNDO/REDO STATE =====
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const isUndoRedo = useRef(false);
  const isInitialized = useRef(false);
  
  // ===== STROKE BATCHING =====
  const strokeGrid = useRef(null);
  const isStrokeActive = useRef(false);

  // ===== ANIMATION STATE =====
  const [frames, setFrames] = useState(savedData.frames);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(savedData.frameIndex);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef(null);

  const cellSize = Math.floor(480 / gridSize);

  // ===== SAVE TO LOCALSTORAGE =====
  const saveToStorage = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRID, JSON.stringify(grid));
      localStorage.setItem(STORAGE_KEYS.GRID_SIZE, String(gridSize));
      localStorage.setItem(STORAGE_KEYS.FRAMES, JSON.stringify(frames));
      localStorage.setItem(STORAGE_KEYS.CURRENT_FRAME, String(currentFrameIndex));
    } catch (error) {
      console.warn('Failed to save to localStorage:', error);
    }
  }, [grid, gridSize, frames, currentFrameIndex]);

  // ===== AUTO-SAVE ON CHANGE =====
  useEffect(() => {
    // Save whenever grid, gridSize, frames, or currentFrameIndex changes
    saveToStorage();
  }, [grid, gridSize, frames, currentFrameIndex, saveToStorage]);

  // ===== SAVE HISTORY =====
  const saveHistory = useCallback((newGrid) => {
    if (isUndoRedo.current) return;
    
    const newHistory = history.slice(0, historyIndex + 1);
    const gridCopy = newGrid.map(row => [...row]);
    newHistory.push(gridCopy);
    
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // ===== START STROKE =====
  const startStroke = useCallback(() => {
    strokeGrid.current = grid.map(row => [...row]);
    isStrokeActive.current = true;
  }, [grid]);

  // ===== END STROKE =====
  const endStroke = useCallback(() => {
    if (isStrokeActive.current && strokeGrid.current) {
      const hasChanged = JSON.stringify(grid) !== JSON.stringify(strokeGrid.current);
      if (hasChanged) {
        saveHistory(grid);
      }
      strokeGrid.current = null;
      isStrokeActive.current = false;
    }
  }, [grid, saveHistory]);

  // ===== UNDO =====
  const undo = useCallback(() => {
    if (isStrokeActive.current) {
      endStroke();
    }
    
    if (historyIndex > 0) {
      isUndoRedo.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setGrid(history[prevIndex].map(row => [...row]));
      setTimeout(() => {
        isUndoRedo.current = false;
      }, 100);
    }
  }, [history, historyIndex, endStroke]);

  // ===== REDO =====
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

  // ===== PAINT CELL =====
  const paintCell = useCallback((row, col) => {
    const newGrid = grid.map(row => [...row]);
    if (currentTool === 'pen') {
      newGrid[row][col] = currentColor;
    } else if (currentTool === 'eraser') {
      newGrid[row][col] = '#ffffff';
    }
    setGrid(newGrid);
  }, [grid, currentTool, currentColor]);

  // ===== FLOOD FILL =====
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

  // ===== CLEAR CANVAS =====
  const clearCanvas = useCallback(() => {
    if (isStrokeActive.current) {
      endStroke();
    }
    
    const emptyGrid = Array.from({ length: gridSize }, () =>
      Array(gridSize).fill('#ffffff')
    );
    
    setGrid(emptyGrid);
    saveHistory(emptyGrid);
  }, [gridSize, saveHistory, endStroke]);

  // ===== RESET GRID =====
  const resetGrid = useCallback((newSize) => {
    const newGrid = Array.from({ length: newSize }, () =>
      Array(newSize).fill('#ffffff')
    );
    setGridSize(newSize);
    setGrid(newGrid);
    setHistory([newGrid.map(row => [...row])]);
    setHistoryIndex(0);
    strokeGrid.current = null;
    isStrokeActive.current = false;
  }, []);

  // ===== INITIALIZE HISTORY =====
  const initialize = useCallback(() => {
    if (!isInitialized.current) {
      const initialGrid = grid.map(row => [...row]);
      setHistory([initialGrid]);
      setHistoryIndex(0);
      isInitialized.current = true;
    }
  }, [grid]);

  // ===== ANIMATION FUNCTIONS =====
  const saveFrame = useCallback(() => {
    if (isStrokeActive.current) {
      endStroke();
    }
    const frameCopy = grid.map(row => [...row]);
    setFrames(prev => [...prev, frameCopy]);
    setCurrentFrameIndex(frames.length);
  }, [grid, frames.length, endStroke]);

  const loadFrame = useCallback((index) => {
    if (index >= 0 && index < frames.length) {
      if (isStrokeActive.current) {
        endStroke();
      }
      const newGrid = frames[index].map(row => [...row]);
      setGrid(newGrid);
      setCurrentFrameIndex(index);
      saveHistory(newGrid);
    }
  }, [frames, saveHistory, endStroke]);

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
    
    if (isStrokeActive.current) {
      endStroke();
    }
    
    setIsAnimating(true);
    let index = 0;
    
    animationRef.current = setInterval(() => {
      index = (index + 1) % frames.length;
      const newGrid = frames[index].map(row => [...row]);
      setGrid(newGrid);
      setCurrentFrameIndex(index);
    }, 300);
  }, [frames, endStroke]);

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



  // ===== EYEDROPPER =====
const eyedropper = useCallback((row, col) => {
  if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
    const color = grid[row][col];
    setCurrentColor(color);
    return color;
  }
  return null;
}, [grid, gridSize, setCurrentColor]);



// Lazy initialization - runs once when hook is first called
const getInitialHistory = () => {
  try {
    const saved = localStorage.getItem('pixelStudio_colorHistory');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.slice(0, MAX_HISTORY);
      }
    }
  } catch (error) {
    console.warn('Failed to load color history:', error);
  }
  // Default: first 4 preset colors
  return PRESET_COLORS.slice(0, 4);
};

// Inside the hook:
const [colorHistory, setColorHistory] = useState(getInitialHistory);
const historyInitialized = useRef(false);

// Add color to history
const addToHistory = useCallback((color) => {
  setColorHistory(prev => {
    const filtered = prev.filter(c => c !== color);
    const newHistory = [color, ...filtered];
    return newHistory.slice(0, MAX_HISTORY);
  });
}, []);

// Save to localStorage when history changes (after initialization)
useEffect(() => {
  if (historyInitialized.current) {
    try {
      localStorage.setItem('pixelStudio_colorHistory', JSON.stringify(colorHistory));
    } catch (error) {
      console.warn('Failed to save color history:', error);
    }
  }
}, [colorHistory]);

// Mark as initialized after first render
useEffect(() => {
  historyInitialized.current = true;
}, []);

// Set current color with history
const setCurrentColorWithHistory = useCallback((color) => {
  setCurrentColor(color);
  addToHistory(color);
}, [addToHistory]);

  return {
    grid,
    gridSize,
    cellSize,
    currentColor,
    currentTool,
    isDrawing,
    hoveredCell,
    setCurrentTool,
    setIsDrawing,
    setHoveredCell,
    paintCell,
    floodFill,
    resetGrid,
    clearCanvas,
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
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
    initialize,
    startStroke,
    endStroke,
    eyedropper,
    colorHistory,
    setCurrentColor: setCurrentColorWithHistory, 
    addToHistory,

  };
}