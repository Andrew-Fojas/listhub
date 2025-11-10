import { loginWithGoogle } from "../services/auth.service.js";

export default function Login(){
  return (
    <main className="container" style={{textAlign:"center", marginTop:"4rem"}}>
      <h2>Welcome to ✨ ListHub ✨</h2>
      <p className="subtitle" style={{margin:"1rem 0 2rem"}}>Sign in to continue</p>
      <button className="btn btn-primary" onClick={loginWithGoogle}>
        Sign in with Google
      </button>
    </main>
  );
}