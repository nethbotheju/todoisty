const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    completed: { type: Boolean, required: true },
    reminder: { type: Boolean, required: true },
    remindertime: { type: String, required: true },
  },
  { timestamps: true }
);

const Todo = mongoose.model("Todo", todoSchema, "todo");

module.exports = Todo;
