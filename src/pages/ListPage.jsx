import { useParams } from "react-router-dom";
import { getListById, addTask, toggleTask } from "../services/lists.service.js";
import ProgressBar from "../components/ProgressBar.jsx";
import TaskItem from "../components/TaskItem.jsx";
import TaskForm from "../components/TaskForm.jsx";

export default function ListPage() {
  const { listId } = useParams();
  const list = getListById(listId);
  if (!list) return <p>List not found.</p>;

  const completed = list.tasks.filter(t => t.done).length;
  const pct = list.tasks.length ? (completed / list.tasks.length) : 0;

  return (
    <main>
      <h1>{list.name}</h1>
      <ProgressBar value={pct} />
      <TaskForm onAdd={(title, desc) => addTask(list.id, title, desc)} />
      <ul>
        {list.tasks.map(t => (
          <TaskItem key={t.id} task={t} onToggle={() => toggleTask(t.id)} />
        ))}
      </ul>
    </main>
  );
}