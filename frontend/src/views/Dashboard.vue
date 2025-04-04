<template>
  <div class="min-h-screen bg-gray-100 p-4 min-w-[1280px]">
    <h1 class="text-3xl font-bold pb-5 ml-20 mb-3">TO-DO LIST APP</h1>

    <div
      class="bg-neutral-300 w-[850px] h-[170px] mb-14 border border-solid rounded-3xl mx-auto"
    >
      <form @submit.prevent="addTodo" class="">
        <!-- Row 1: To-do Input -->
        <div class="pt-5 pl-10">
          <input
            v-model="newTodo"
            placeholder="Add a to-do"
            class="p-2 w-[700px] bg-transparent border-transparent focus:outline-none focus:border-b-2 focus:border-black"
            maxlength="90"
          />
          <div class="text-sm text-gray-500 mt-1 absolute ml-[580px]">
            {{ newTodo.length }}&nbsp;/&nbsp;90&nbsp;characters
          </div>
        </div>

        <!-- Row 2: Date Picker, Time Picker, and Button -->
        <div class="flex items-center pl-8 mt-8">
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

          <span class="pl-3 text-lg"> Reminder</span>
          <div class="ml-2 mt-2">
            <label class="inline-flex items-center cursor-pointer">
              <input type="checkbox" v-model="reminder" class="sr-only peer" />
              <div
                class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
              ></div>
            </label>
          </div>

          <div class="flex justify-end ml-[120px]">
            <button
              v-if="edit_todo"
              class="bg-gray-500 text-white p-2 rounded-xl w-[70px] ml-[22px]"
              @click="cancelEdit"
            >
              Cancel
            </button>

            <button
              class="bg-blue-500 text-white p-2 rounded-xl w-[70px]"
              :class="!edit_todo ? 'ml-[100px]' : 'ml-2'"
            >
              {{ edit_todo ? "Done" : "Add" }}
            </button>
          </div>
        </div>
      </form>
    </div>

    <div
      class="bg-neutral-300 w-[1050px] h-[500px] border border-solid rounded-3xl mx-auto"
    >
      <!-- Filter Buttons -->
      <div
        class="ml-20 pl-10 pr-10 pt-[70px] flex flex-col w-[300px] space-y-8 text-xl"
      >
        <button
          class="p-2 mr-3 rounded-3xl"
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
          class="p-2 mr-3 rounded-3xl"
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
          class="p-2 mr-3 rounded-3xl"
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
          class="p-2 mr-3 rounded-3xl"
          :class="
            activeFilter === 'all'
              ? 'bg-blue-700 text-white'
              : 'bg-blue-500 text-black'
          "
          @click="setActiveFilter('all')"
        >
          All
        </button>
      </div>

      <div class="w-[550px] ml-[435px] mt-[-275px]">
        <ul
          class="flex flex-col items-center max-w-[500px] mx-auto h-[380px] overflow-y-auto custom-scrollbar"
        >
          <li
            v-for="todo in display_tasks"
            :key="todo.id"
            class="flex flex-col mb-8 border-b p-2 rounded-md bg-blue-200 border-blue-500 transition-opacity relative w-full max-w-[450px]"
            @mouseover="hovering[todo.id] = true"
            @mouseleave="hovering[todo.id] = false"
          >
            <!-- First row: Tick icon and task title -->
            <div class="flex items-center w-full">
              <img
                :src="hoveringTick[todo.id] ? tickCompleteImg : tickImg"
                class="w-5 cursor-pointer transition-opacity"
                @mouseover="hoveringTick[todo.id] = true"
                @mouseleave="hoveringTick[todo.id] = false"
                @click="removeTodo(todo.id)"
              />
              <span
                class="text-lg pl-3 flex-1 w-[350px] break-words"
                style="line-height: 1.4"
              >
                {{ todo.title }}
              </span>
            </div>

            <!-- Second row: Date, time, and Edit button -->
            <div class="text-sm pl-8 pt-3 pb-1 flex items-center relative">
              <img src="./assets/calender.svg" class="w-[23px] pr-[5px]" />
              <span class="pr-2"> {{ todo.date }} </span>
              <img src="./assets/clock.svg" class="w-[23px] pr-[4px] ml-2" />
              <span> {{ todo.time ? todo.time : "--:--" }} </span>

              <!-- Edit button (second row) -->
              <button
                class="ml-auto bg-gray-300 rounded-lg transition-opacity absolute right-0 mt-[-4px] hover:outline outline-[1.5px]"
                v-if="hovering[todo.id] && !hoveringTick[todo.id]"
                :class="hovering[todo.id] ? 'opacity-100' : 'opacity-0'"
                style="width: 50px; height: 25px"
                @click="edit(todo.id)"
              >
                Edit
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!-- Notification Popup -->
    <div
      v-if="notificationVisible"
      class="fixed top-5 right-6 bg-blue-500 text-white p-6 rounded-lg shadow-lg transition-opacity duration-500"
      :class="{
        'opacity-100': notificationVisible,
        'opacity-0': !notificationVisible,
      }"
      @transitionend="onTransitionEnd"
    >
      Reminder! <br />In 15 min you have a task to complete. <br />Task: "{{
        currentTodo.title
      }}"
    </div>
  </div>
</template>

<style>
/* Hide the button responsible for opening the time picker */
.dp__btn[data-test="open-time-picker-btn"] {
  display: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px; /* Width of the scrollbar */
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: white; /* Background color of the scrollbar track */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgb(58, 57, 57); /* Color of the scrollbar handle */
  border-radius: 10px; /* Optional: Rounded corners for the scrollbar handle */
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: white; /* Darker color on hover */
}
</style>

<script>
import {
  getTodos,
  createTodo,
  deleteTodo,
  updateTodo,
} from "../services/todoService";
import tickImg from "../assets/tick.svg"; // Import tick.svg
import tickCompleteImg from "../assets/tick-complete.svg"; // Import tick-complete.svg
import VueDatePicker from "@vuepic/vue-datepicker"; // Import Vue Date Picker
import "@vuepic/vue-datepicker/dist/main.css"; // Import default styles for the date picker
import clockIcon from "../assets/clock.svg"; // Import clock icon
import reminderAudio from "../assets/reminderAudio.mp3";

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
      hoveringTick: {}, // Object to track hover state for each todo
      tickImg, // Image import
      tickCompleteImg, // Image import
      activeFilter: "today", // Track which filter is active, default to 'today'
      dateFormat: "yyyy-MM-dd",
      clockIcon, // Clock Icon import
      edit_todo: null,
      reminder: false, // This will toggle true/false with the checkbox
      remindertime: null,
      currentTime: null,
      currentDate: null,
      notificationVisible: false, // Track notification visibility
      currentTodo: {}, // Hold the current todo details
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

    const now = new Date();
    const seconds = now.getSeconds();

    // Calculate the delay to the next full minute (when seconds == 0)
    const delay = (60 - seconds) * 1000;

    // Set a timeout to trigger at the start of the next full minute
    setTimeout(() => {
      // Call the function immediately
      this.setTheRemainder();

      // Then set the interval to run every minute (60000ms)
      setInterval(this.setTheRemainder, 60000);
    }, delay);
  },

  methods: {
    // Format time into HH:mm format
    formatTime(time) {
      if (!time || time.hours == null || time.minutes == null) return "";

      const hours = String(time.hours).padStart(2, "0");
      const minutes = String(time.minutes).padStart(2, "0");

      return `${hours}:${minutes}`;
    },

    formattedReminderTime(time) {
      if (time == null) {
        return "00:00";
      } else {
        return this.subtractMinutes(time, 15);
      }
    },

    subtractMinutes(time, minutesToSubtract) {
      // Create a Date object for today and set the hours and minutes
      const [hours, minutes] = time.split(":").map(Number);
      const date = new Date();
      date.setHours(hours);
      date.setMinutes(minutes);

      // Subtract the minutes
      date.setMinutes(date.getMinutes() - minutesToSubtract);

      // Format the time back to HH:mm
      const updatedHours = String(date.getHours()).padStart(2, "0");
      const updatedMinutes = String(date.getMinutes()).padStart(2, "0");

      return `${updatedHours}:${updatedMinutes}`;
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
      if (this.newTodo.trim() === "") {
        this.errorMessage = "Please enter a to-do";
        return;
      }

      try {
        this.errorMessage = "";

        // Format the time before saving it
        const formattedTime = this.todoTime
          ? this.formatTime(this.todoTime)
          : null;

        if (this.edit_todo) {
          // Update the existing task using the updateTodo function
          const updatedTodo = await updateTodo(
            this.edit_todo.id,
            this.newTodo,
            this.todoDate,
            formattedTime,
            this.reminder,
            this.formattedReminderTime(formattedTime) // Use 'this'
          );

          // Find the todo in the array and update it
          const index = this.todos.findIndex(
            (todo) => todo.id === this.edit_todo.id
          );
          if (index !== -1) {
            this.todos.splice(index, 1, updatedTodo); // Replace the todo in the list
          }

          this.edit_todo = null; // Clear the edit state after updating
        } else {
          // Otherwise, add a new task
          const newTodoObj = {
            title: this.newTodo,
            date: this.todoDate,
            time: formattedTime,
            reminder: this.reminder,
            remindertime: this.formattedReminderTime(formattedTime), // Use 'this'
          };

          const newTodo = await createTodo(
            newTodoObj.title,
            newTodoObj.date,
            newTodoObj.time,
            this.reminder,
            newTodoObj.remindertime // Make sure to pass the correct value
          );

          this.todos.push(newTodo); // Add the newly created todo
        }

        this.applyFilter(); // Reapply the current filter to update the task list

        // Clear input fields after adding/editing the todo
        this.newTodo = "";
        this.todoDate = this.getTodayDate();
        this.todoTime = null;
        this.reminder = false;
        this.remindertime = null; // You might want to clear this too
      } catch (error) {
        console.error("Failed to add/edit to-do", error);
        this.errorMessage = "Failed to add/edit to-do. Please try again.";
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

    edit(id) {
      // Find the todo to be edited by its id
      const todoToEdit = this.todos.find((todo) => todo.id === id);

      // Populate the form with the selected todo's data for editing
      if (todoToEdit) {
        this.newTodo = todoToEdit.title; // Set the title in the input field

        // Convert the date string (YYYY-MM-DD) to a Date object
        this.todoDate = new Date(todoToEdit.date); // VueDatePicker expects a Date object

        // Convert the time string (HH:mm) to an object with hours and minutes
        if (todoToEdit.time) {
          const [hours, minutes] = todoToEdit.time.split(":").map(Number);
          this.todoTime = { hours, minutes }; // VueDatePicker expects a time object
        } else {
          this.todoTime = null; // Handle case where time is null or not available
        }

        if (todoToEdit.reminder) {
          this.reminder = true;
        }
        this.edit_todo = todoToEdit; // Keep track of the todo being edited
      }
    },

    cancelEdit() {
      this.edit_todo = null; // Clear the edit state
      this.newTodo = ""; // Clear the input field
      this.todoDate = this.getTodayDate(); // Reset date to today
      this.todoTime = null; // Reset time to null
      this.reminder = false;
      this.remindertime = null;
    },

    setTheRemainder() {
      this.currentDate = this.getTodayDate();
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      this.currentTime = `${hours}:${minutes}`;

      this.todos.forEach((todo) => {
        if (todo.reminder) {
          if (
            todo.date === this.currentDate &&
            todo.remindertime === this.currentTime
          ) {
            const audio = new Audio(reminderAudio);

            // Play the audio for the first time
            audio.play().catch((error) => {
              console.error("Audio playback failed:", error);
            });

            // Set the current todo and show the notification
            this.currentTodo = todo; // Set the current todo
            this.showNotification();

            // Set a timeout to play the audio again after 4 seconds
            setTimeout(() => {
              audio.currentTime = 0; // Reset the audio to the beginning
              audio.play().catch((error) => {
                console.error("Audio playback failed:", error);
              });
            }, 4000);
          }
        }
      });
    },

    showNotification() {
      this.notificationVisible = true;

      // Hide the notification after 5 seconds
      setTimeout(() => {
        this.notificationVisible = false;
      }, 10000);
    },

    onTransitionEnd() {
      if (!this.notificationVisible) {
        this.notificationVisible = false; // Ensure it is hidden after transition
      }
    },
  },
};
</script>
