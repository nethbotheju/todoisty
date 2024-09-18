const API_URL = "http://localhost:5001/todos";

export async function getTodos() {
  const response = await fetch(API_URL);
  return response.json();
}

export async function createTodo(title) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return response.json();
}

export async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
