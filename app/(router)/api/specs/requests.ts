"use server";
import { revalidateTag } from "next/cache";
import { spec } from "@prisma/client";
import { ISpec } from "@/app/_types/types";

export async function getSpecsByFilters(filtersObj={}): Promise<spec[]> {
  const filters = Object.entries(filtersObj).map(([name, value]) => `${name}=${value}`).join("&");
  const res = await fetch(`http://localhost:3000/api/specs?${filters}`, {
    method: "GET",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSpecsByFilters'");
  const data = await res.json();
  return data;
}

export async function getSpecById(id:string): Promise<ISpec> {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {
    method: "GET",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'getSpecById'");
  const data = await res.json();
  return data;
}

export async function upsertSpec(state:ISpec, init:ISpec): Promise<spec> {
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

export async function deleteSpecById(id:number): Promise<void> {
  const res = await fetch(`http://localhost:3000/api/specs/${id}`, {
    method: "DELETE",
    next: { tags: ["specs"] },
  });
  if (!res.ok) throw new Error("Failed to fetch data 'deleteSpecById'");
  const data = await res.json();
  revalidateTag("specs");
  return data;
}

export async function getEmptySpec(): Promise<ISpec> {
  return {
    name_service: "",
    name_filter: "",
    object_type: "org",
    control_type: "checkbox",
  }
}