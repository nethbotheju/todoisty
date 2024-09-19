<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <h1 class="text-3xl font-bold pb-5 ml-20 mb-3">TO-DO LIST APP</h1>

    <div
      class="bg-neutral-300 w-[850px] h-[140px] mb-10 border border-solid rounded-3xl mx-auto"
    >
      <form @submit.prevent="addTodo" class="">
        <!-- Row 1: To-do Input -->
        <div class="pt-5 pl-10">
          <input
            v-model="newTodo"
            placeholder="Add a to-do"
            class="p-2 w-[700px] bg-transparent border-transparent focus:outline-none focus:border-b-2 focus:border-black"
          />
        </div>

        <!-- Row 2: Date Picker, Time Picker, and Button -->
        <div class="flex items-center pl-8 mt-2">
          <VueDatePicker
            v-model="todoDate"
            :format="dateFormat"
            :placeholder="'Select date'"
            class="m-2"
            style="width: 152px"
            :clearable="false"
            :min-date="getTodayDate()"
          ></VueDatePicker>

          <!-- Time Input -->
          <VueDatePicker
            v-model="todoTime"
            time-picker
            :enable-time="true"
            :format="'HH:mm'"
            :placeholder="'Select time'"
            class="m-2 w-28"
          >
            <!-- Customize the time picker icon using the 'input-icon' slot -->
            <template #input-icon>
              <img
                :src="clockIcon"
                class="w-10"
                alt="Clock Icon"
                style="padding: 5px 11px"
              />
            </template>
          </VueDatePicker>

          <button
            class="bg-blue-500 text-white p-2 ml-[400px] rounded-xl w-[70px]"
          >
            Add
          </button>
        </div>
      </form>
    </div>

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

<style>
/* Hide the button responsible for opening the time picker */
.dp__btn[data-test="open-time-picker-btn"] {
  display: none;
}
</style>

<script>
import { getTodos, createTodo, deleteTodo } from "./services/todoService";
import tickImg from "./assets/tick.svg"; // Import tick.svg
import tickCompleteImg from "./assets/tick-complete.svg"; // Import tick-complete.svg
import VueDatePicker from "@vuepic/vue-datepicker"; // Import Vue Date Picker
import "@vuepic/vue-datepicker/dist/main.css"; // Import default styles for the date picker
import clockIcon from "./assets/clock.svg"; // Import clock icon

export default {
  components: {
    VueDatePicker, // Register it here
  },

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
      dateFormat: "yyyy-MM-dd",
      clockIcon, // Clock Icon import
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
    // Format time into HH:mm format
    formatTime(time) {
      if (!time || time.hours == null || time.minutes == null) return "";

      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");

      return `${hours}:${minutes}`;
    },

    // Returns today's date in YYYY-MM-DD format
    getTodayDate() {
      const today = new Date();
      // Use toLocaleDateString() to get the date in local time and format it as yyyy-mm-dd
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
      const day = String(today.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
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
      // Create a new date object for tomorrow by adding 1 day
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      // Format tomorrow's date as yyyy-mm-dd using local time
      const year = tomorrow.getFullYear();
      const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
      const day = String(tomorrow.getDate()).padStart(2, "0");

      const tomorrowDate = `${year}-${month}-${day}`;

      // Filter todos by tomorrow's date
      this.display_tasks = this.todos.filter(
        (todo) => todo.date === tomorrowDate
      );
    },

    // This method filters todos that are scheduled after today (upcoming tasks)
    upcoming() {
      const today = new Date();

      // Format today's date as yyyy-mm-dd using local time
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
      const day = String(today.getDate()).padStart(2, "0");

      const todayDate = `${year}-${month}-${day}`;

      // Filter todos that are scheduled after today
      this.display_tasks = this.todos.filter((todo) => todo.date > todayDate);
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

        // Format the time before saving it
        const formattedTime = this.todoTime
          ? this.formatTime(this.todoTime)
          : null;

        const newTodoObj = {
          title: this.newTodo,
          date: this.todoDate,
          time: formattedTime, // Save the formatted time (HH:mm AM/PM)
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
