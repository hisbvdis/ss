"use server";
export async function getAllSpecs() {
  const res = await fetch("http://localhost:3000/api/specs", {method: "GET"});
  if (!res.ok) throw new Error("Failed to fetch data 'getAllSpecs'");
  return res.json();
}

export async function getSpecById(id) {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {method: "GET"});
  if (!res.ok) throw new Error("Failed to fetch data 'getSpecById'");
  return res.json();
}

export async function upsertSpec(state, init) {
  const res = await fetch("http://localhost:3000/api/specs", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({state, init})
  });
  if (!res.ok) throw new Error("Failed to fetch data 'upsertSpec'");
  return res.json();
}

export async function deleteSpecById(id) {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {method: "DELETE"});
  if (!res.ok) throw new Error("Failed to fetch data 'deleteSpecById'");
  return res.json();
}