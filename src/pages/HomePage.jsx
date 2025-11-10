import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import StatsBar from "../components/StatsBar.jsx";
import ListCard from "../components/ListCard.jsx";
import { getMe } from "../services/auth.service.js";
import { getLists, createList, removeList } from "../services/lists.service.js";
import CreateListModal from "../components/CreateListModal.jsx";
import ConfirmDeleteListModal from "../components/ConfirmDeleteListModal.jsx";

export default function HomePage(){
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
  const [me, setMe] = useState(undefined);

  const [createOpen, setCreateOpen] = useState(false);
  const [version, setVersion] = useState(0);  // force refetch after create

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedList, setSelectedList] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const user = await getMe();
        if (alive) setMe(user);
      } catch {
        if (alive) setMe(null);
      }
    })();
    return () => { alive = false; };
  }, []);
     
  const loadLists = async () => {
    setLoading(true);
    try {
      const data = await getLists();
      setLists(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to Get any Lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLists(); }, []);

    // Guard
    if (me === undefined) return null;
    if (!me) return <Navigate to="/login" replace />;

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
              <ListCard
                key={list.id}
                list={list}
                onDelete={(l) => { setSelectedList(l); setDeleteOpen(true); }}
              />
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

      {/* Delete List */}
      <ConfirmDeleteListModal
        open={deleteOpen}
        onClose={() => { setDeleteOpen(false); setSelectedList(null); }}
        list={selectedList}
        onConfirm={async () => {
          // optimistic remove
          setLists(prev => prev.filter(l => l.id !== selectedList.id));
          setDeleteOpen(false);

          // server delete
          await removeList(selectedList.id);

          // update StatsBar categories
          setVersion(v => v + 1);  
          // await loadLists();
          setSelectedList(null);
        }}
      />
    </main>
  );
}
