<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold text-center pb-5">My To-Do List</h1>
    <form
      @submit.prevent="addTodo"
      class="flex flex-col justify-center items-center mb-6"
    >
      <!-- To-do Input -->
      <input
        v-model="newTodo"
        placeholder="Add a to-do"
        class="border p-2 m-2 w-56"
      />

      <!-- Date Input (default to today's date) -->
      <input type="date" v-model="todoDate" class="border p-2 m-2 w-56" />

      <!-- Time Input (default to null) -->
      <input
        type="time"
        v-model="todoTime"
        class="border p-2 m-2 w-56"
        placeholder="Add time"
      />

      <button class="bg-blue-500 text-white p-2">Add</button>
    </form>

    <ul class="flex flex-col items-center max-w-md mx-auto">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex flex-col mb-8 border-b p-2 rounded-md bg-blue-200 border-blue-500 hover:opacity-50 transition-opacity cursor-pointer relative w-full max-w-sm"
        @mouseover="hovering[todo.id] = true"
        @mouseleave="hovering[todo.id] = false"
        @click="removeTodo(todo.id)"
      >
        <div class="flex items-center w-full">
          <img
            :src="hovering[todo.id] ? tickCompleteImg : tickImg"
            class="w-5 cursor-pointer transition-opacity"
          />
          <span class="text-lg pl-3 flex-1 max-w-xs break-words">
            {{ todo.title }}
          </span>
        </div>
        <div class="text-sm pl-8 pt-1 flex items-center">
          <span class="pr-2"> {{ todo.date }} </span>
          <span> {{ todo.time }} </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getTodos, createTodo, deleteTodo } from "./services/todoService";
import tickImg from "./assets/tick.svg"; // Import tick.svg
import tickCompleteImg from "./assets/tick-complete.svg"; // Import tick-complete.svg

export default {
  data() {
    return {
      todos: [], // Array for storing todos
      newTodo: "", // Model for the new to-do input
      todoDate: this.getTodayDate(), // Default date set to today
      todoTime: null, // Default time set to null
      errorMessage: "", // Error message for validation
      hovering: {}, // Object to track hover state for each todo
      tickImg, // Image import
      tickCompleteImg, // Image import
    };
  },

  async mounted() {
    try {
      // Fetch existing todos when the component is mounted
      this.todos = await getTodos();
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  },

  methods: {
    getTodayDate() {
      const today = new Date();
      return today.toISOString().substr(0, 10); // Returns YYYY-MM-DD format
    },

    async addTodo() {
      // Input validation: check if newTodo (title) is empty
      if (this.newTodo.trim() === "") {
        this.errorMessage = "Please enter a to-do";
        return;
      }

      try {
        // If valid, clear the error message and proceed
        this.errorMessage = "";

        // Create the new to-do object including text, date, and time
        const newTodoObj = {
          title: this.newTodo, // Use 'title' as per API naming
          date: this.todoDate, // Add the selected date
          time: this.todoTime || null, // Add time or null if not provided
        };

        // Call createTodo API with the title, date, and time
        const newTodo = await createTodo(
          newTodoObj.title,
          newTodoObj.date,
          newTodoObj.time
        );

        // Add the newly created todo to the list of todos
        this.todos.push(newTodo);

        // Clear the input fields after adding the todo
        this.newTodo = "";
        this.todoDate = this.getTodayDate(); // Reset date to today's date
        this.todoTime = null; // Reset time to null
      } catch (error) {
        console.error("Failed to add to-do", error);
        this.errorMessage = "Failed to add to-do. Please try again.";
      }
    },

    async removeTodo(id) {
      try {
        // Remove the to-do via API or method
        await deleteTodo(id);

        // Filter out the deleted to-do from the list
        this.todos = this.todos.filter((todo) => todo.id !== id);
      } catch (error) {
        console.error("Failed to delete to-do", error);
        this.errorMessage = "Failed to delete to-do. Please try again.";
      }
    },
  },
};
</script>
