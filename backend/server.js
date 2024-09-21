const express = require("express");
const cors = require("cors");
const { sequelize, Todo, syncDatabase } = require("./db"); // Import Todo model and sequelize instance

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
  const { title, date, time, reminder, remindertime } = req.body;

  // Validate input
  if (!title || !date) {
    return res.status(400).json({ error: "Title and date are required" });
  }

  try {
    const newTodo = await Todo.create({
      title,
      date,
      time,
      reminder,
      remindertime,
    });
    res.json(newTodo);
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.destroy({ where: { id: req.params.id } });
    if (result) {
      res.json({ message: "Todo deleted successfully" });
    } else {
      res.status(404).json({ error: "Todo not found" });
    }
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Update a todo by its ID
app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { title, date, time, reminder, remindertime } = req.body;

  try {
    const todo = await Todo.findByPk(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Update the todo properties
    todo.title = title;
    todo.date = date;
    todo.time = time;
    todo.reminder = reminder;
    todo.remindertime = remindertime;
    await todo.save(); // Save changes

    res.json(todo); // Send the updated todo as a response
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Sync the database and start the server
(async () => {
  try {
    await syncDatabase(); // Call the sync function
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
  }
})();
