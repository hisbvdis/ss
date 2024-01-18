"use server";
import { revalidateTag } from "next/cache";

export async function getObjectsByFilters(filters) {
  const filterString =  Object.entries(filters)
    .filter(([_, value]) => value)
    .map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/objects?${filterString}`, {
    method: "GET",
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getObjectsByFilters'");
  const data = await res.json();
  return data;
}

export async function getObjectsByCityAndName({cityId, type, query}) {
  if (!cityId || !type || !query) return;
  const res = await fetch(`http://localhost:3000/api/objects?cityId=${cityId}&query=${query}&type=${type}`, {
    method: "GET",
    next: { tags: ["objects"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getObjectsByCityAndName'");
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
  schedule: [
    {day_num: 1, name_ru_short: "Пн"},
    {day_num: 2, name_ru_short: "Вт"},
    {day_num: 3, name_ru_short: "Ср"},
    {day_num: 4, name_ru_short: "Чт"},
    {day_num: 5, name_ru_short: "Пт"},
    {day_num: 6, name_ru_short: "Сб"},
    {day_num: 7, name_ru_short: "Вс"},
  ],
  }
}