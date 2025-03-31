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
