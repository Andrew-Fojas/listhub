import { Link } from "react-router-dom";

export default function Header(){
  return (
    <header className="app-header container">
      <h2>✨ ListHub ✨</h2>
      <p className="subtitle">Stay organized and productive!</p>
      <Link to="/" className="btn btn-primary create-list-btn">Create New List</Link>
    </header>
  );
}