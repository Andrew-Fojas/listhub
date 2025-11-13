export default function TaskCard({ task, onToggle, onEdit, onDelete }){
    const formatDate = (date) => {
      if (!date) return "";
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    };

    const formatTime = (time) => {
      if (!time) return "";
      const [hours, minutes] = time.split(":");
      const hour = parseInt(hours, 10);
      const ampm = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const formatDateTime = () => {
      if (!task.date && !task.time) return null;
      const parts = [];
      if (task.date) parts.push(formatDate(task.date));
      if (task.time) parts.push(formatTime(task.time));
      return parts.join(" ");
    };

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
          {formatDateTime() ? <div className="task-desc" style={{fontSize: '0.85em', color: '#666'}}>{formatDateTime()}</div> : null}
        </div>

        <div className="task-actions">
        <button className="icon-pill icon-pill--edit" onClick={() => onEdit?.(task)} title="Edit">✎</button>
        <button className="icon-pill" onClick={() => onDelete?.(task)} title="Delete">⌫</button>
        </div>
      </li>
    );
}  