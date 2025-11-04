import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getListById, addTask, toggleTask } from "../services/lists.service.js";
import ProgressBar from "../components/ProgressBar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";

export default function ListPage(){
  const { listId } = useParams();

  const [list, setList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(null);

  // load once per listId
  useEffect(() => {
    let alive = true;
    setLoading(true);
    (async () => {
      try {
        // await the API
        const data = await getListById(listId);  
        if (!alive) return;
        setList({
          ...data,
          tasks: Array.isArray(data?.tasks) ? data.tasks : [], // normalize
        });
        setError(null);
      } catch (err) {
        if (alive) setError(err.message || "Failed to load list");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [listId]);

  // re-fetch after mutations
  const refresh = async () => {
    const data = await getListById(listId);
    setList({
      ...data,
      tasks: Array.isArray(data?.tasks) ? data.tasks : [],
    });
  };

  if (loading) return <main className="container--wide"><p>Loading list…</p></main>;
  if (error)   return <main className="container--wide"><p style={{color:"red"}}>{error}</p></main>;
  if (!list)   return <main className="container--wide"><p>List not found.</p></main>;

  const tasks = list.tasks;
  const completed = tasks.filter(t => t.done).length;
  const pct = tasks.length ? completed / tasks.length : 0;

  return (
    <main>
      <div className="container--wide" style={{marginBottom:'1rem'}}>
        <Link to="/" className="btn btn-ghost">← Back to All Lists</Link>
      </div>

      {/* Header */}
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

      {/* Task list */}
      <section className="container--wide">
        <div className="tasks-shell">
          <h3 style={{marginBottom:'1rem'}}>All Tasks</h3>
          <ul>
            {tasks.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={async () => { await toggleTask(t.id); await refresh(); }}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
            {tasks.length === 0 && <p className="muted">No tasks yet — add one.</p>}
          </ul>
        </div>
      </section>

      {/* Modal */}
      <AddTaskModal
        open={open}
        onClose={()=>setOpen(false)}
        onCreate={async (title, desc) => {
          await addTask(list.id, title, desc);
          await refresh();
        }}
      />
    </main>
  );
}