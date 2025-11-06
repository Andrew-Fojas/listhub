import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import StatsBar from "../components/StatsBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { getLists } from "../services/lists.service.js";

export default function HomePage(){
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await getLists();
        if (alive) {
          setLists(data);
          setError(null);
        }
      } catch (err) {
        if (alive) setError(err.message || "Failed to load lists");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  return (
    <main>
      <Header />

      {}
      <StatsBar />

      <section className="container section">
        {loading && <p>Loading lists…</p>}
        {error && <p style={{color:"red"}}>{error}</p>}

        {!loading && !error && (
          <div className="lists-grid">
            {lists.map(list => (
              <ListCard key={list.id} list={list} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
