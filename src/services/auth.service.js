const API_URL = import.meta.env.VITE_API_URL || "";

export async function getMe() {
    const res = await fetch(`${API_URL}/auth/me`, { credentials: "include" });
    if (!res.ok) return null;
    return res.json();
}

export function loginWithGoogle() {
      // redirect to backend
      window.location.assign(`${API_URL}/auth/google`);
}

export async function logout() {
    await fetch(`${API_URL}/auth/logout`, { method: "POST", credentials: "include" });
}  