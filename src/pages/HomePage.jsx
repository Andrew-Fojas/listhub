import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import StatsBar from "../components/StatsBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { getLists } from "../services/lists.service.js";

export default function HomePage(){
  const lists = getLists();
  return (
    <main>
      <Header />
      <StatsBar />

      <section className="container section">
        <div className="lists-grid">
          {lists.map(list => <ListCard key={list.id} list={list} />)}
        </div>
      </section>
    </main>
  );
}