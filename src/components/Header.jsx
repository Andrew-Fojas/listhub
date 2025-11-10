import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMe, loginWithGoogle, logout } from "../services/auth.service.js";

export default function Header({ onCreateList }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  // Guard: redirect to login when explicitly logged out
  if (user === null) return <Navigate to="/login" replace />;

  return (
    <header className="app-header container">
      <h2>✨ ListHub ✨</h2>
      <p className="subtitle">Stay organized and productive!</p>

      {user ? (
        <div style={{ display: "flex", gap: ".5rem", alignItems: "center" }}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt=""
              style={{ width: 32, height: 32, borderRadius: 8 }}
            />
          ) : null}
          <span>{user.name}</span>
          <button
            className="btn btn-ghost"
            onClick={async () => {
              await logout();
              // trigger Navigate
              setUser(null); 
            }}
          >
            Log out
          </button>
          <button
            className="btn btn-primary create-list-btn"
            onClick={onCreateList}
          >
            Create New List
          </button>
        </div>
      ) : user === undefined ? (
        // while loading auth
        <div>Loading...</div>
      ) : (
        <button
          className="btn btn-primary create-list-btn"
          onClick={loginWithGoogle}
        >
          Sign in with Google
        </button>
      )}
    </header>
  );
}