import { Link } from "react-router-dom";

export default function ListCard({ list, onDelete }){
  const previews = list.tasks.slice(0,3);

  const tasks = Array.isArray(list.tasks) ? list.tasks : [];
  const count = tasks.length;
  return (
    <article className="list-card">
      <div className="list-header">
        <h3 className="list-title">{list.name}</h3>

        <div style={{display:'flex', alignItems:'center', gap:'.5rem'}}>
          <span className="list-count">{count} {count === 1 ? "task" : "tasks"}</span>
          <button
            type="button"
            className="icon-pill"
            title="Delete list"
            onClick={() => onDelete?.(list)}
            aria-label={`Delete list ${list.name}`}
          >
            ⌫
          </button>
        </div>
      </div>

      <ul>
        {previews.map(t => (
          <li key={t.id} className="task-preview">
            <input type="checkbox" readOnly checked={t.done} className={`chk ${t.done ? 'is-checked' : ''}`} />
            <span className={`task-text ${t.done ? 'is-done' : ''}`}>{t.title}</span>
          </li>
        ))}
      </ul>

      <Link to={`/lists/${list.id}`} className="btn btn-primary btn-block view-all-btn">
        View all tasks →
      </Link>
    </article>
  );
}