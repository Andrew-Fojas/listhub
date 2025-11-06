import { useEffect, useState } from "react";
import Header from "../components/Header.jsx";
import StatsBar from "../components/StatsBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { getLists, createList } from "../services/lists.service.js";
import CreateListModal from "../components/CreateListModal.jsx";

export default function HomePage(){
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const [createOpen, setCreateOpen] = useState(false);
  // force refetch after create
  const [version, setVersion] = useState(0);

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
       {/* Pass click handler to header button */}
       <Header onCreateList={() => setCreateOpen(true)} />

      {/* Re-mount StatsBar after create so totals refresh */}
      <StatsBar key={version} />

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

      <CreateListModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={async (name) => {
          // create on the server { id, name }
          const created = await createList(name); 
          // optimistic add
          setLists(prev => [...prev, { ...created, tasks: [] }]);
          setCreateOpen(false);
          setVersion(v => v + 1)

          //  re-fetch to sync counts/ordering from server
          loadLists();
        }}
      />
    </main>
  );
}
