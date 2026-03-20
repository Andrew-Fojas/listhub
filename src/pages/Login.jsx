import { loginWithGoogle } from "../services/auth.service.js";
import "../styles/login.css";

const features = [
  {
    icon: "📋",
    title: "Organize with Lists",
    desc: "Create multiple lists to keep your tasks grouped by project, category, or anything you like.",
  },
  {
    icon: "✅",
    title: "Track Your Progress",
    desc: "Check off tasks as you go and watch your completion progress update in real time.",
  },
  {
    icon: "⏰",
    title: "Schedule Tasks",
    desc: "Assign a date and time to any task so you always know what needs to happen and when.",
  },
  {
    icon: "📧",
    title: "Email Reminders",
    desc: "Opt in to get an email reminder 10 minutes before a scheduled task is due.",
  },
];

export default function Login() {
  return (
    <div className="login-page">
      <div className="login-header">
        <h1 className="login-brand">ListHub</h1>
        <p className="login-tagline">
          Your simple, focused space for staying on top of what matters.
        </p>
      </div>

      {/* Sign-in card */}
      <div className="login-card">
        <h2>Welcome back</h2>
        <div className="login-divider" />
        <p className="subtitle">Sign in to access your lists</p>

        <button className="google-btn" onClick={loginWithGoogle}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
            <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332Z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 6.294C4.672 4.169 6.656 3.58 9 3.58Z"/>
          </svg>
          Sign in with Google
        </button>

        <p className="login-fine-print">
          By signing in you agree to keep your lists awesome.
        </p>
      </div>

      {/* 2×2 feature grid */}
      <div className="feature-grid">
        {features.map(({ icon, title, desc }) => (
          <div className="feature-item" key={title}>
            <span className="feature-icon">{icon}</span>
            <div className="feature-text">
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
