import { useEffect, useState } from "react";
import { getLists } from "../services/lists.service.js";

export default function StatsBar() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    remaining: 0,
    categories: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const lists = await getLists();  // now async from API
        if (!alive) return;

        const allTasks = lists.flatMap(l => l.tasks || []);
        const total = allTasks.length;
        const completed = allTasks.filter(t => t.done).length;
        const remaining = total - completed;
        const categories = lists.length;

        setStats({ total, completed, remaining, categories });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <div className="container section">
      <div className="stats-bar">
        <StatItem label="Total Tasks" value={loading ? "…" : stats.total} />
        <StatItem label="Completed" value={loading ? "…" : stats.completed} />
        <StatItem label="Remaining" value={loading ? "…" : stats.remaining} />
        <StatItem label="Categories" value={loading ? "…" : stats.categories} />
      </div>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div className="stat-item">
      <span className="stat-number">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}
