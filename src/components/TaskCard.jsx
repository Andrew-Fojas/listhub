export default function TaskCard({ task, onToggle, onEdit, onDelete }){
    return (
      <li className={`task-card ${task.done ? 'done':''}`}>
        <div style={{display:'grid', gap:'.3rem'}}>
          <label className="task-title">
            <input
              type="checkbox"
              className={`chk ${task.done ? 'is-checked' : ''}`}
              checked={task.done}
              onChange={onToggle}
            />
            <span className={`task-text ${task.done ? 'is-done':''}`}>{task.title}</span>
          </label>
          {task.desc ? <div className="task-desc">{task.desc}</div> : null}
        </div>
  
        <div className="task-actions">
        <button className="icon-pill icon-pill--edit" onClick={() => onEdit?.(task)} title="Edit">✎</button>
        <button className="icon-pill" onClick={() => onDelete?.(task)} title="Delete">⌫</button>
        </div>
      </li>
    );
}  