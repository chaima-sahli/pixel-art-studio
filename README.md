<div align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Canvas-2D2D2D?style=for-the-badge&logo=html5&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  
  <br />
  <br />
  
  <h1>Pixel Art Studio</h1>
  <p><strong>Create pixel art in your browser.</strong></p>
  <p>A canvas-based pixel art editor with flood fill, color tools, and PNG export.<br />Built in vanilla JS, ported to React.</p>
  
  <br />
  
  <a href="#-features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#-the-process">The Process</a> •
  <a href="#-implementation-details">Implementation</a> •
  <a href="#-what-i-learned">What I Learned</a> •
  <a href="#-live-demo">Live Demo</a>
  
  <br />
  <br />
  
  <!-- <img src="./docs/screenshot.png" alt="Pixel Art Studio Screenshot" width="80%" /> -->
</div>

---

## 📖 About

**Pixel Art Studio** is a browser-based pixel art editor. It renders a grid on HTML5 Canvas, handles mouse interactions for drawing, and includes common tools like pen, eraser, and flood fill.

The project includes **two implementations**:
- **Vanilla JS** - Plain HTML/CSS/JS using Canvas API
- **React** - React version with hooks and component architecture

---

## ✨ Features

### Core Features

| Feature | Description |
|---------|-------------|
| **Pen Tool** | Click and drag to draw on the grid |
| **Eraser Tool** | Remove pixels with precision |
| **Flood Fill** | Fill contiguous regions with one click |
| **Color Palette** | 16 preset colors + custom color picker |
| **Grid Sizing** | Switch between 16x16, 32x32, and 64x64 |
| **PNG Export** | Clean export without grid lines |
| **Hover Preview** | See where you're about to paint |
| **Drag Painting** | Click and drag for continuous drawing |

### 🎨 Design
- Dark theme for extended use
- Responsive sidebar layout
- Active tool and color indicators

---

## Tech Stack

### Vanilla Version
```
├── HTML5
├── CSS3
├── JavaScript ES6+
└── Canvas 2D API
```
### React Version
```
├── React 18
├── Vite
├── React Hooks (useState, useEffect, useCallback)
├── Custom Hooks
└── CSS Modules
```

---

## 📁 Project Structure
```
pixel-art-studio/
├── vanilla-version/
│ ├── index.html # App structure
│ ├── style.css # Dark theme styling
│ └── script.js # Canvas logic, flood fill, events
├── src/
│ ├── components/
│ │ ├── Canvas.jsx # Canvas rendering + mouse events
│ │ ├── Toolbar.jsx # Tool selection (pen, eraser, fill)
│ │ ├── ColorPalette.jsx# Preset colors + custom picker
│ │ └── GridControls.jsx# Grid size switcher
│ ├── hooks/
│ │ └── usePixelArt.js # Grid state, drawing logic
│ └── App.jsx
└── README.md
```

---

## 👩🏽‍🍳 The Process
Built the vanilla JS version first to understand Canvas API basics. Then ported to React.

1. **Grid & rendering** - 2D array with fillRect per cell
2. **Mouse events** - mousedown, mousemove, mouseup with coordinate mapping
3. **Flood fill** - Iterative stack approach (recursion crashed on larger grids)
4. **React migration** - Global vars → useState, render() → useEffect, UI → components
5. **Polish** - Custom colors, grid sizing, PNG export

---

## 🔧 Implementation Details

### Flood Fill Algorithm
Uses an iterative stack approach to avoid call stack limits:

```javascript
function floodFill(row, col, newColor) {
  const target = grid[row][col];
  if (target === newColor) return;

  const stack = [[row, col]];
  while (stack.length) {
    const [r, c] = stack.pop();
    if (r < 0 || r >= gridSize || c < 0 || c >= gridSize) continue;
    if (grid[r][c] !== target) continue;
    
    grid[r][c] = newColor;
    stack.push([r-1,c], [r+1,c], [r,c-1], [r,c+1]);
  }
  render();
}
```
### Coordinate Mapping
Converts mouse events to grid positions:

```javascript
function getCellFromMouse(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  return {
    row: Math.floor(y / cellSize),
    col: Math.floor(x / cellSize)
  };
}
``` 
### State Management Comparison

| Aspect      | Vanilla JS            | React                 | 
| --------    | --------------------- | --------------------- | 
| State       | Global variables      | useState              | 
| Rendering   | Manual render() call  | useEffect             | 
| DOM updates | Direct manipulation   | Virtual DOM           | 
| Events      | addEventListener      | Inline props          | 



## Future Improvements
| Feature	       |     Status     |
| ---------------- | -------------- |
| Undo/Redo	       |    Planning    |
| Save/Load JSON   | 	Planning    |
| Touch Support	   |    Planning    |
| Animation Frames |	Planning    |

## Running Locally

``` bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## ✦ Author ✦

**Chaima Sahli**

- GitHub: [@chaima-sahli](https://github.com/chaima-sahli)
- LinkedIn: [chaima-sahli](https://linkedin.com/in/chaima-sahli)


##  Live Demo
**soon**


<div align="center">
   <pre>
    ════════════════════════════════════════════════════════════
    ██████╗ ██╗██╗  ██╗███████╗██╗      █████╗ ██████╗ ████████╗
    ██╔══██╗██║╚██╗██╔╝██╔════╝██║     ██╔══██╗██╔══██╗╚══██╔══╝
    ██████╔╝██║ ╚███╔╝ █████╗  ██║     ███████║██████╔╝   ██║   
    ██╔═══╝ ██║ ██╔██╗ ██╔══╝  ██║     ██╔══██║██╔══██╗   ██║   
    ██║     ██║██╔╝ ██╗███████╗███████╗██║  ██║██║  ██║   ██║   
    ╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   
    ════════════════════════════════════════════════════════════
      🎨 Create pixel art in your browser
    ════════════════════════════════════════════════════════════

   </pre>
</div>


