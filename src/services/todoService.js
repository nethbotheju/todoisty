const API_URL = "http://localhost:5001/todos";

// Fetch all todos
export async function getTodos() {
  const response = await fetch(API_URL);
  return response.json(); // Returns an array of todos including date, time, reminder, remindertime
}

// Create a new todo with title, date, time, reminder, and remindertime
export async function createTodo(title, date, time, reminder, remindertime) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, date, time, reminder, remindertime }), // Send data as JSON
  });
  return response.json(); // Returns the created todo object
}

// Delete a todo by its ID
export async function deleteTodo(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

// Update a todo by its ID with title, date, time, reminder, and remindertime
export async function updateTodo(
  id,
  title,
  date,
  time,
  reminder,
  remindertime
) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, date, time, reminder, remindertime }), // Send updated data
  });
  return response.json(); // Return updated todo
}
