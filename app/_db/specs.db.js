"use server";

export async function getAllSpecs() {
  const res = await fetch("http://localhost:3000/api/specs");
  return res.json();
}