<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite" />
  <img src="https://img.shields.io/badge/Canvas-API-2D2D2D?style=for-the-badge&logo=html5" />
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/GIF-Export-FF6B6B?style=for-the-badge" />
  
  <br />
  <br />
  
  <h1>🎨 Pixel Art Studio</h1>
  <p><strong>Create pixel art in your browser.</strong></p>
  <p>A full-featured pixel art editor with canvas rendering, color history, animation frames, and GIF export.</p>
  
  <br />
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-usage">Usage</a> •
  <a href="#-the-process">The process</a> 
  
  <br />
  <br />
  
  
</div>

---

## 📖 About

> **Pixel Art Studio** is a browser-based pixel art editor built with React and Canvas API. It features a complete toolset including pen, eraser, flood fill, color history, animation frames, and GIF export. Built as a learning journey from vanilla JS to React.

---

## 🎯 Live Demo

Try it here!: https://pixel-art-maker-studio.vercel.app

---

## 🎥 Video Demo



---

## ✨ Features
| Feature | Description |
|---------|-------------|
| 🖌️ **Drawing Tools** | Pen, Eraser, Flood Fill (Paint Bucket) |
| 🎨 **Color System** | 8 Preset Colors + Custom Picker + 8 Recent Colors (History) |
| 📐 **Grid Sizes** | 16×16, 32×32, 64×64 |
| ↩️ **Undo/Redo** | Ctrl+Z, Ctrl+Y with stroke batching |
| 🎬 **Animation** | Frame management with Play/Stop |
| 💾 **Export** | PNG Download + Animated GIF Export |
| 🗑️ **Clear Canvas** | With confirmation modal |
| 💾 **Auto-save** | localStorage with save status indicator |
| ⌨️ **Keyboard Shortcuts** | P, E, F, I, 1-8, Shift+1-8, Ctrl+Z, Ctrl+Y |
| 🔊 **Sound Effects** | 8-bit retro sounds |
| 💉 **Eyedropper** | Pick colors directly from canvas |
| 🎮 **Retro UI** | RGB Arcade/TV Screen aesthetic |

### 🎨 Drawing Tools

| Feature | Description |
|---------|-------------|
| **Pen Tool** | Click and drag to draw pixels |
| **Eraser Tool** | Remove pixels with precision |
| **Flood Fill** | Fill contiguous regions with one click |
| **Eyedropper Tool** | Pick colors directly from the canvas |

### 🎨 Color System

| Feature | Description |
|---------|-------------|
| **8 Preset Colors** | Always available essential colors |
| **8 Recent Colors** | Automatically tracks colors used on canvas |
| **Custom Color Picker** | Choose any color with native picker |
| **Smart History** | Colors added to history when actually used |

### 📐 Grid System

| Feature | Description |
|---------|-------------|
| **Grid Sizes** | 16×16, 32×32, 64×64 options |
| **Hover Preview** | See where you're about to paint |
| **Drag Painting** | Click and drag for continuous drawing |

### 🎬 Animation

| Feature | Description |
|---------|-------------|
| **Frame Management** | Save, load, delete frames |
| **Play/Stop** | Animate through frames in sequence |
| **GIF Export** | Export your animation as a GIF |

### 💾 Export Options

| Feature | Description |
|---------|-------------|
| **PNG Export** |Download your artwork as a PNG image|
| **GIF Export** | Export animations as GIF (requires 2+ frames) |
| **Smart Export** | Clean export without grid lines |

### ↩️ Undo/Redo

| Feature | Description |
|---------|-------------|
| **Smart Batching** | Entire stroke grouped as one undo step |
| **Keyboard Shortcuts** | Ctrl+Z / Ctrl+Y |
| **Floating Buttons** | Always accessible over the canvas |

### 🔊 Sound Effects

| Feature | Description |
|---------|-------------|
| **8-bit Sounds** |Retro sound effects for interactions|
| **Throttled Drawing** | No sound spam during long drags |
| **Game-like Feedback** | Click, paint, and success sounds |

### ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `P` | Pen Tool |
| `E` | Eraser Tool |
| `F` | Fill Tool |
| `I` | Eyedropper Tool |
| `1-8` | Select Preset Colors |
| `Shift+1-8` | Select More Colors |
| `Ctrl+Z` | Undo |
| `Ctrl+Y` / `Ctrl+Shift+Z` | Redo |

### 💾 Auto-save

| Feature | Description |
|---------|-------------|
| **localStorage** | Your artwork is saved automatically |
| **Status Indicator** | Shows when your work is saved |
| **Persistent** | Survives page refreshes and tab closures |

---

## 💻 Tech Stack

### Frontend

```
├── React 18
├── Vite
├── Canvas 2D API
├── CSS3
└── Press Start 2P Font

```

### Libraries
```
├── gif.js (GIF Export)
├── React Hooks
├── Custom Hooks
└── Web Audio API (Sound Effects)

```

### Features

```
├── Canvas Rendering
├── Flood Fill Algorithm
├── Color History
├── Animation Frames
├── GIF Export
└── Auto-save
```

---

## 📁 Project Structure
```
pixel-art-studio/
├── src/
│ ├── components/
│ │ ├── Canvas.jsx # Canvas rendering + mouse events
│ │ ├── Toolbar.jsx # Tool selection (Pen, Eraser, Fill, Eyedropper)
│ │ ├── ColorPalette.jsx # Preset colors + History
│ │ ├── GridControls.jsx # Grid size selector
│ │ ├── UndoRedoButtons.jsx # Floating undo/redo + clear
│ │ └── Modal.jsx # Reusable confirmation modal
│ ├── hooks/
│ │ ├── usePixelArt.js # Main logic hook
│ │ └── useSound.js # 8-bit sound effects
│ ├── utils/
│ │ └── gifExporter.js # GIF export utility
│ ├── App.jsx
│ └── App.css
├── public/
│ └── gif.worker.js # GIF.js worker script
├── index.html
├── package.json
└── README.md

```
---

## 🚀 Quick Start

### 1. Clone it
```bash
git clone https://github.com/chaima-sahli/pixel-art-studio.git
cd pixel-art-studio

```
### 2. Install dependencies
```bash
npm install
```

### 3.  Start development server
```bash
npm run dev
```

## 🎮 Usage
1. Select a tool - Pen (P), Eraser (E), Fill (F), or Eyedropper (I)
2. Choose a color - Click preset colors, recent colors, or use the custom picker
3. Draw - Click and drag on the canvas
4. Add frames - Draw different frames and click ➕ to save
5. Export - Download as PNG or GIF animation
6. Auto-save - Your work is automatically saved to localStorage





## 👩🏽‍🍳 The Process

Built the vanilla JS version first to understand Canvas API basics. Then ported to React.

| Step | What I Did | Why |
|------|------------|-----|
| **1. Grid & Rendering** | 2D array with `fillRect` per cell | Learned manual pixel manipulation |
| **2. Mouse Events** | `mousedown`, `mousemove`, `mouseup` with coordinate mapping | Understood event handling and coordinate systems |
| **3. Flood Fill** | Iterative stack approach (recursion crashed on larger grids) | Learned about algorithm optimization |
| **4. React Migration** | Global vars → `useState`, `render()` → `useEffect`, UI → components | Understood React's mental model |
| **5. Polish** | Custom colors, grid sizing, PNG export | Added user-friendly features |

> **Why both versions?** Building in vanilla JS first gave me a deep understanding of the Canvas API and DOM manipulation. Porting to React showed me how frameworks abstract away the complexity while adding structure and maintainability.

---


## ✦ Author ✦

**Chaima Sahli**

- GitHub: [@chaima-sahli](https://github.com/chaima-sahli)
- LinkedIn: [chaima-sahli](https://linkedin.com/in/chaima-sahli)





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


