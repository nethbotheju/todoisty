const express = require("express");
const cors = require("cors");
const { Todo } = require("./db"); // Import Todo model

const app = express();
app.use(cors());
app.use(express.json());

const port = 5001;

// Get all todos
app.get("/todos", async (req, res) => {
  const todos = await Todo.findAll();
  res.json(todos);
});

// Create a new todo
app.post("/todos", async (req, res) => {
  const newTodo = await Todo.create({
    title: req.body.title,
  });
  res.json(newTodo);
});

// Delete a todo by id
app.delete("/todos/:id", async (req, res) => {
  const result = await Todo.destroy({
    where: { id: req.params.id },
  });
  res.json({ deleted: result });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
