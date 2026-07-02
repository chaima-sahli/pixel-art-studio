import { useSound } from '../hooks/useSound';

const TOOLS = [
  { id: 'pen', label: '✏️', title: 'Pen (P)' },
  { id: 'eraser', label: '🧹', title: 'Eraser (E)' },
  { id: 'fill', label: '🪣', title: 'Fill (F)' },
];

export function Toolbar({ currentTool, setCurrentTool }) {
  const { playSound } = useSound();

  const handleToolClick = (toolId) => {
    setCurrentTool(toolId);
    playSound('click'); 
  };

  return (
    <div className="toolbar">
      {TOOLS.map((tool) => (
        <button
          key={tool.id}
          className={`tool-btn ${currentTool === tool.id ? 'active' : ''}`}
          onClick={() => handleToolClick(tool.id)}
          title={tool.title}
        >
          {tool.label}
          <span style={{paddingTop:"5px"}}>{tool.title.match(/\(([^)]+)\)/)?.[1] || ''}</span>
        </button>
      ))}
    </div>
  );
}