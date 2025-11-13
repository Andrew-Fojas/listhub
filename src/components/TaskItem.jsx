export default function TaskItem({ task, onToggle }) {
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
      <li>
        <label>
          <input type="checkbox" checked={task.done} onChange={onToggle} />
          <strong>{task.title}</strong>
        </label>
        {task.desc ? <div>{task.desc}</div> : null}
        {formatDateTime() ? <div style={{fontSize: '0.85em', color: '#666'}}>{formatDateTime()}</div> : null}
      </li>
    );
  }  