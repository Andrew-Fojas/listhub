import { counts } from "../services/lists.service.js";

export default function StatsBar(){
  const { total, completed, remaining, categories } = counts();
  const Item = ({num, label}) => (
    <div className="stat-item">
      <span className="stat-number">{num}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
  
  return (
    <div className="container section">
      <div className="stats-bar">
        <Item num={total} label="Total Tasks" />
        <Item num={completed} label="Completed" />
        <Item num={remaining} label="Remaining" />
        <Item num={categories} label="Categories" />
      </div>
    </div>
  );
}
