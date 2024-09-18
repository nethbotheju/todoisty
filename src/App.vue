<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold text-center pb-5">My To-Do List</h1>
    <form
      @submit.prevent="addTodo"
      class="flex justify-center items-center mb-6"
    >
      <input
        v-model="newTodo"
        placeholder="Add a to-do"
        class="border p-2 m-2 w-56"
      />
      <button class="bg-blue-500 text-white p-2">Add</button>
    </form>
    <ul class="flex flex-col items-center max-w-md mx-auto">
      <li
        v-for="todo in todos"
        :key="todo.id"
        class="flex items-center mb-8 border-b p-1 pr-2 rounded-md bg-blue-200 border-blue-500 hover:opacity-50 transition-opacity cursor-pointer relative"
        @mouseover="hovering[todo.id] = true"
        @mouseleave="hovering[todo.id] = false"
        @click="removeTodo(todo.id)"
      >
        <img
          :src="hovering[todo.id] ? tickCompleteImg : tickImg"
          class="w-5 cursor-pointer transition-opacity"
        />
        <span class="w-64 text-lg pl-3">
          {{ todo.title }}
        </span>
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
    async addTodo() {
      // Input validation: check if newTodo is empty
      if (this.newTodo.trim() === "") {
        this.errorMessage = "Please enter a to-do";
        return;
      }

      try {
        // If valid, clear error message and proceed
        this.errorMessage = "";

        // Create new to-do via API or method and update todos list
        const newTodo = await createTodo(this.newTodo);

        // Add the newly created todo to the list
        this.todos.push(newTodo);

        // Clear the input field
        this.newTodo = "";
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
