const TOOLS = [
  { id: 'pen', label: '✏️', title: 'Pen (P)' },
  { id: 'eraser', label: '🧹', title: 'Eraser (E)' },
  { id: 'fill', label: '🪣', title: 'Fill (F)' },
];

export function Toolbar({ currentTool, setCurrentTool }) {
  return (
    <div className="toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
          onClick={() => setCurrentTool(tool.id)}
          title={tool.title}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}