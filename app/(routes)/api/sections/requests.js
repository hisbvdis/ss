"use server";
import { revalidateTag } from "next/cache";

export async function getSectionsByFilters(filters) {
  const filterString =  filters && Object.entries(filters).map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/sections?${filterString}`, {
    method: "GET",
    next: { tags: ["sections"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSectionsByFilters'");
  const data = await res.json();
  return data;
}

export async function getSectionById(id) {
  const res = await fetch(`http://localhost:3000/api/sections/${id}`, {
    method: "GET",
    next: { tags: ["sections"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSectionById'");
  const data = await res.json();
  return data;
}

export async function upsertSection(state, init) {
  const res = await fetch("http://localhost:3000/api/sections", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({state, init}),
    next: { tags: ["sections"] },
  })
  if (!res.ok) throw new Error("Failed to fetch data 'upsertSections'");
  const data = await res.json();
  revalidateTag("sections");
  return data;
}

export async function deleteSectionById(id) {
  const res = await fetch(`http://localhost:3000/api/sections/${id}`, {
    method: "DELETE",
    next: { tags: ["sections"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'deleteSectionById'");
  const data = await res.json();
  revalidateTag("sections");
  return data;
}

export async function getEmptySection() {
  return {
    object_type: "org",
  }
}