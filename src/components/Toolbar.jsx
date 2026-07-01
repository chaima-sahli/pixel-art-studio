const TOOLS = [
  { id: 'pen', label: '✏️', title: 'Pen' },
  { id: 'eraser', label: '🧹', title: 'Eraser' },
  { id: 'fill', label: '🪣', title: 'Fill' },
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
          style={{
            padding: '10px',
            fontSize: '20px',
            background: currentTool === tool.id ? '#333' : 'transparent',
            border: '2px solid #444',
            borderRadius: '8px',
            cursor: 'pointer',
            color: '#fff',
            width: '52px',
            height: '52px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {tool.label}
        </button>
      ))}
    </div>
  );
}