const API_URL = "http://localhost:5001/todos";

// Fetch all todos
export async function getTodos() {
  const response = await fetch(API_URL);
  return response.json(); // Returns an array of todos including date and time
}

// Create a new todo with title, date, and time
export async function createTodo(title, date, time) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title, // Title of the todo
      date, // Date for the todo
      time, // Time for the todo (can be null)
    }),
  });
  return response.json(); // Returns the created todo object
}

// Delete a todo by its ID
export async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}
