import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import StatsBar from "../components/StatsBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { getLists } from "../services/lists.service.js";

export default function HomePage() {
  const lists = getLists();
  return (
    <main>
      <Header />
      <StatsBar />
      <section>
        {lists.map(list => (
          <ListCard key={list.id} list={list}>
            <Link to={`/lists/${list.id}`}>View all tasks →</Link>
          </ListCard>
        ))}
      </section>
    </main>
  );
}