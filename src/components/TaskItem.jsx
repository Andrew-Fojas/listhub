export default function TaskItem({ task, onToggle }) {
    return (
      <li>
        <label>
          <input type="checkbox" checked={task.done} onChange={onToggle} />
          <strong>{task.title}</strong>
        </label>
        {task.desc ? <div>{task.desc}</div> : null}
      </li>
    );
  }  