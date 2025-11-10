export async function getMe() {
    const res = await fetch("/auth/me", { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
}
  
export function loginWithGoogle() {
      // redirect to backend
      //window.location.assign("http://localhost:5174/auth/google");
      window.location.assign("/auth/google");
}
  
export async function logout() {
    await fetch("/auth/logout", { method: "POST", credentials: "include" });
}  