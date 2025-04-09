const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

const port = 5001;

const Todo = require("./models/todo");
const User = require("./models/user");
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
    res.status(500).json({ error });
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
    res.status(500).json({ error });
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
    res.status(500).json({ error });
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
    res.status(500).json({ error });
  }
});

app.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || !lastName || !email || !password) {
    return res.status(400).json({ error: "Required fields are missing" });
  }

  try {
    const excistingUser = await User.findOne({ email });
    if (excistingUser) {
      return res.status(409).json({ error: "User is already registered." });
    }

    const encyptedPassword = await bcrypt.hash(password, 10);

    await User.create({
      firstName,
      lastName,
      email,
      password: encyptedPassword,
    });

    res.status(201).json({ message: "User successfully registered." });
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password || !rememberMe) {
    return res.status(400).json({
      error:
        "Required fields are missing either email or password or rememberMe",
    });
  }

  try {
    // Create a access Token

    if (rememberMe == true) {
      // Create a refresh Token
    }

    const excistingUser = await User.findOne({ email });
    if (!excistingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    const passwordCheck = await bcrypt.compare(
      excistingUser.password,
      password
    );

    if (passwordCheck) {
      return res.status(401).json({ error: "Password is incorrect." });
    }

    res.status(200).json({ message: "User successfully logged in." });
  } catch (error) {
    res.status(500).json({ error });
  }
});
