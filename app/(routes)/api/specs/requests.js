"use server";
import { revalidateTag } from "next/cache";

export async function getAllSpecs() {
  const res = await fetch("http://localhost:3000/api/specs", {
    method: "GET",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getAllSpecs'");
  const data = await res.json();
  return data;
}

export async function getSpecsByFilters(filters) {
  const filterString =  Object.entries(filters).map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/specs?${filterString}`, {
    method: "GET",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSpecsByFilters'");
  const data = await res.json();
  return data;
}

export async function getSpecById(id) {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {
    method: "GET",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSpecById'");
  const data = await res.json();
  return data;
}

export async function upsertSpec(state, init) {
  const res = await fetch("http://localhost:3000/api/specs", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({state, init}),
    next: { tags: ["specs"] },
  })
  if (!res.ok) throw new Error("Failed to fetch data 'upsertSpec'");
  const data = await res.json();
  revalidateTag("specs");
  return data;
}

export async function deleteSpecById(id) {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {
    method: "DELETE",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'deleteSpecById'");
  const data = await res.json();
  revalidateTag("specs");
  return data;
}