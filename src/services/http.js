export async function jget(url){
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function jpost(url, body){
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type":"application/json" },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
export async function jpatch(url, body){
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type":"application/json" },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function jdel(url){
  const res = await fetch(url, { 
    method: "DELETE" 
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
