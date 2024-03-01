"use server";
import { revalidateTag } from "next/cache";

export async function getObjectsByFilters(filtersObj) {
  const filters = Object.entries(filtersObj).map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/objects?${filters}`, {
    method: "GET",
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getObjectsByFilters'");
  const data = await res.json();
  return data;
}

export async function getObjectsCount(section, options) {
  const res = await fetch(`http://localhost:3000/api/objects/count?section=${section}&options=${options}`, {
    method: "GET",
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getObjectsCount'");
  const data = await res.json();
  return data;
}

export async function getObjectById(id) {
  const res = await fetch(`http://localhost:3000/api/objects/${id}`, {
    method: "GET",
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getObjectById'");
  const data = await res.json();
  return data;
}

export async function upsertObject(state, init) {
  const res = await fetch("http://localhost:3000/api/objects", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({state, init}),
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'upsertObject'");
  const data = await res.json();
  revalidateTag("objects");
  return data;
}

export async function deleteObject(id) {
  const res = await fetch(`http://localhost:3000/api/objects/${id}`, {
    method: "DELETE",
    next: { tags: ["objects"] },
  })
  if (!res.ok) throw new Error("Failed to fetch data 'deleteObject'");
  const data = await res.json();
  revalidateTag("objects");
  return data;
}

export async function getEmptyObject() {
  return {
    status: "works",
    schedule: Array(7).fill().map((_,i) => ({day_num: i})),
  }
}