import { counts } from "../services/lists.service.js";
export default function StatsBar() {
  const { total, completed, remaining, categories } = counts();
  return (
    <nav>
      <span>{total} Total</span>
      <span>{completed} Completed</span>
      <span>{remaining} Remaining</span>
      <span>{categories} Categories</span>
    </nav>
  );
}