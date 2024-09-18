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

    <!-- Filter Buttons -->
    <button
      class="p-2 mr-3"
      :class="
        activeFilter === 'today'
          ? 'bg-blue-700 text-white'
          : 'bg-blue-500 text-black'
      "
      @click="setActiveFilter('today')"
    >
      Today
    </button>
    <button
      class="p-2 mr-3"
      :class="
        activeFilter === 'tomorrow'
          ? 'bg-blue-700 text-white'
          : 'bg-blue-500 text-black'
      "
      @click="setActiveFilter('tomorrow')"
    >
      Tomorrow
    </button>
    <button
      class="p-2 mr-3"
      :class="
        activeFilter === 'upcoming'
          ? 'bg-blue-700 text-white'
          : 'bg-blue-500 text-black'
      "
      @click="setActiveFilter('upcoming')"
    >
      Upcoming
    </button>
    <button
      class="p-2 mr-3"
      :class="
        activeFilter === 'all'
          ? 'bg-blue-700 text-white'
          : 'bg-blue-500 text-black'
      "
      @click="setActiveFilter('all')"
    >
      All
    </button>

    <ul class="flex flex-col items-center max-w-md mx-auto">
      <li
        v-for="todo in display_tasks"
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
      display_tasks: [], // Filtered tasks for display
      newTodo: "", // Model for the new to-do input
      todoDate: this.getTodayDate(), // Default date set to today
      todoTime: null, // Default time set to null
      errorMessage: "", // Error message for validation
      hovering: {}, // Object to track hover state for each todo
      tickImg, // Image import
      tickCompleteImg, // Image import
      activeFilter: "today", // Track which filter is active, default to 'today'
    };
  },

  async mounted() {
    try {
      // Fetch existing todos when the component is mounted
      this.todos = await getTodos();
      this.applyFilter(); // Apply the active filter (default: today)
    } catch (error) {
      console.error("Failed to fetch todos", error);
    }
  },

  methods: {
    // Returns today's date in YYYY-MM-DD format
    getTodayDate() {
      const today = new Date();
      return today.toISOString().substr(0, 10);
    },

    // Apply the active filter
    applyFilter() {
      if (this.activeFilter === "all") {
        this.all();
      } else if (this.activeFilter === "today") {
        this.today();
      } else if (this.activeFilter === "tomorrow") {
        this.tomorrow();
      } else if (this.activeFilter === "upcoming") {
        this.upcoming();
      }
    },

    setActiveFilter(filter) {
      this.activeFilter = filter; // Set the active filter
      this.applyFilter(); // Apply the filter
    },

    // This method sets display_tasks to show all todos
    all() {
      this.display_tasks = [...this.todos]; // Copy all todos to display_tasks
    },

    // This method filters todos that have today's date and displays them
    today() {
      const today = this.getTodayDate();
      this.display_tasks = this.todos.filter((todo) => todo.date === today); // Filter todos by today's date
    },

    // This method filters todos that are scheduled for tomorrow
    tomorrow() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1); // Increment the day by 1
      const tomorrowDate = tomorrow.toISOString().substr(0, 10); // Format to YYYY-MM-DD
      this.display_tasks = this.todos.filter(
        (todo) => todo.date === tomorrowDate
      ); // Filter todos by tomorrow's date
    },

    // This method filters todos that are scheduled after today (upcoming tasks)
    upcoming() {
      const today = new Date().toISOString().substr(0, 10); // Get today's date in YYYY-MM-DD format
      this.display_tasks = this.todos.filter((todo) => todo.date > today); // Filter todos with a date later than today
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

        // Reapply the current filter instead of calling all()
        this.applyFilter();

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

        // Reapply the current filter instead of calling all()
        this.applyFilter();
      } catch (error) {
        console.error("Failed to delete to-do", error);
        this.errorMessage = "Failed to delete to-do. Please try again.";
      }
    },
  },
};
</script>
