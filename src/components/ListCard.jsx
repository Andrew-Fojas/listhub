import { Link } from "react-router-dom";

export default function ListCard({ list }){
  const previews = list.tasks.slice(0,3);
  return (
    <article className="list-card">
      <div className="list-header">
        <h3 className="list-title">{list.name}</h3>
        <span className="list-count">{list.tasks.length} tasks</span>
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