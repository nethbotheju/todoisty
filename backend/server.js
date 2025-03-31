const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(express.json());

const port = 5001;

const Todo = require("./models/todo");
const connectDB = require("./config/database");

// Connect to the database
connectDB();

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const { title, date, time, reminder, remindertime } = req.body;

  if (!title || !date || !time || !reminder || !remindertime) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const newTodo = await Todo.create({
      title,
      date,
      time,
      reminder,
      remindertime,
      completed: false,
    });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Delete a todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.findByIdAndDelete(req.params.id);
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
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Update the todo properties
    todo.title = title;
    todo.date = date;
    todo.time = time;
    todo.reminder = reminder;
    todo.remindertime = remindertime;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});
