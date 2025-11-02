import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getListById, addTask, toggleTask } from "../services/lists.service.js";
import ProgressBar from "../components/ProgressBar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";

export default function ListPage() {
  const { listId } = useParams();
  const [version, setVersion] = useState(0);
  const [open, setOpen] = useState(false);
  const refresh = () => setVersion(v => v + 1);

  const list = getListById(listId);
  if (!list) return <div className="container--wide"><p>List not found.</p></div>;

  const completed = list?.tasks?.filter(t => t.done).length || [];
  const pct = list.tasks.length ? completed / list.tasks.length : 0;

  return (
    <main>
      {/* Top back link */}
      <div className="container--wide" style={{ marginBottom: "1rem" }}>
        <Link to="/" className="btn btn-ghost">← Back to All Lists</Link>
      </div>

      {/* Header card */}
      <div className="container--wide">
        <div className="tasks-shell">
        <div className="hero-top">
          <div className="hero-heading">
            <h1>{list.name}</h1>
          </div>
          <button className="btn btn-primary add-task-btn" onClick={() => setOpen(true)}>
            + Add Task
          </button>
        </div>

          <ProgressBar value={pct} />
            <small className="progress-meta">
              {completed} of {list.tasks.length} tasks completed
            </small>
        </div>
      </div>


      {/* All tasks block */}
      <section className="container--wide">
        <div className="tasks-shell">
          <h3 style={{ marginBottom: "1rem" }}>All Tasks</h3>
          <ul>
            {list.tasks.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={() => { toggleTask(t.id); refresh(); }}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Create-task modal */}
      <AddTaskModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(title, desc) => { addTask(list.id, title, desc); refresh(); }}
      />
    </main>
  );
}