import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getListById, addTask, toggleTask /*, deleteTask, editTask*/ } from "../services/lists.service.js";
import ProgressBar from "../components/ProgressBar.jsx";
import TaskCard from "../components/TaskCard.jsx";
import AddTaskModal from "../components/AddTaskModal.jsx";

export default function ListPage(){
  const { listId } = useParams();
  const [version, setVersion] = useState(0);
  const [open, setOpen] = useState(false);
  const refresh = () => setVersion(v => v + 1);

  const list = getListById(listId);
  if (!list) return <div className="container"><p>List not found.</p></div>;

  const completed = list.tasks.filter(t => t.done).length;
  const pct = list.tasks.length ? completed / list.tasks.length : 0;

  return (
    <main>
      <div className="container--wide" style={{marginBottom:'1rem'}}>
        <Link to="/" className="btn btn-ghost">← Back to All Lists</Link>
      </div>

      {/* Header card */}
      <div className="container--wide">
        <div className="list-hero">
          <div>
            <h1>{list.name}</h1>
            <div style={{marginTop:'.75rem'}}>
              <ProgressBar value={pct} />
              <small className="progress-meta">{completed} of {list.tasks.length} tasks completed</small>
            </div>
          </div>
          <button className="btn btn-primary add-task-btn" onClick={()=>setOpen(true)}>+ Add Task</button>
        </div>
      </div>

      {/* All Tasks shell */}
      <section className="container--wide">
        <div className="tasks-shell">
          <h3 style={{marginBottom:'1rem'}}>All Tasks</h3>
          <ul>
            {list.tasks.map(t => (
              <TaskCard
                key={t.id}
                task={t}
                onToggle={() => { toggleTask(t.id); refresh(); }}
                onEdit={() => {/* later */}}
                onDelete={() => {/* later */}}
              />
            ))}
          </ul>
        </div>
      </section>

      {/* Modal */}
      <AddTaskModal
        open={open}
        onClose={()=>setOpen(false)}
        onCreate={(title, desc) => { addTask(list.id, title, desc); refresh(); }}
      />
    </main>
  );
}