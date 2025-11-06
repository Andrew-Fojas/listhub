import { Link } from "react-router-dom";

export default function Header({ onCreateList }){
  return (
    <header className="app-header container">
      <h2>✨ ListHub ✨</h2>
      <p className="subtitle">Stay organized and productive!</p>
      <button
        type="button"
        className="btn btn-primary create-list-btn"
        onClick={onCreateList}
      >
        Create New List
      </button>
    </header>
  );
}