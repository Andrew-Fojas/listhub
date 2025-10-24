import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <h1>✨ ListHub ✨</h1>
      <h3>The Hub for Go-Getters!</h3>
      <Link to="/">Create New List</Link>
    </header>
  );
}