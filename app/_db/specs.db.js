export const emptySpec = {
  object_type: "org",
  control_type: "checkbox",
}

export async function getAllSpecs() {
  await fetch("http://localhost:3000/api/specs");
}

export async function getSpecById(id) {
  await fetch("http://localhost:3000/api/specs/${id}");
}

export async function deleteSpecById(id) {
  await fetch("http://localhost:3000/api/specs/${id}", {method: "DELETE"});
}

export async function upsertSpec(state, init) {
  await fetch("http://localhost:3000/api/specs", {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({state, init})
  });
}