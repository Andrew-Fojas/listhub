const API_URL = import.meta.env.VITE_API_URL || "";

export async function jget(url){
  const res = await fetch(`${API_URL}${url}`, { credentials: 'include' });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function jpost(url, body){
  const res = await fetch(`${API_URL}${url}`, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    credentials: 'include',
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function jpatch(url, body){
  const res = await fetch(`${API_URL}${url}`, {
    method: "PATCH",
    headers: { "Content-Type":"application/json" },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function jdel(url){
  const res = await fetch(`${API_URL}${url}`, {
    method: "DELETE",
    credentials: 'include'
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
