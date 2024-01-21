"use server";

export async function getCitiesByFilters(filtersObj={}) {
  const filters = Object.entries(filtersObj).map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/cities?${filters}`, {
    method: "GET",
    next: { tags: ["cities"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getCitiesByFilters'");
  const data = await res.json();
  return data;
}

export async function getCityById(id) {
  const res = await fetch(`http://localhost:3000/api/cities/${id}`, {
    method: "GET",
    next: { tags: ["cities"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getCityById'");
  const data = await res.json();
  return data;
}