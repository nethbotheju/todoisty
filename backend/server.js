const express = require("express");
const cors = require("cors");
const { Todo } = require("./db"); // Import Todo model

const app = express();
app.use(cors());
app.use(express.json());

const port = 5001;

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll();
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const { title, date, time } = req.body;

  // Validate input
  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" });
  }

  try {
    const newTodo = await Todo.create({
      title,
      date, // Store the date
      time, // Store the time (can be null)
    });
    res.json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Delete a todo by id
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.destroy({
      where: { id: req.params.id },
    });
    res.json({ deleted: result });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
