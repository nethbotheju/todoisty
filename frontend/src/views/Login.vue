<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-1"
    >
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-blue-500">Todoisty</h1>
        <p class="text-gray-500 mt-1">Manage your tasks efficiently</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="Enter your email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="Enter your password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="flex items-center">
            <input
              type="checkbox"
              v-model="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span class="ml-2 text-sm text-gray-700">Remember me</span>
          </label>
          <a
            href="#"
            class="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >Forgot password?</a
          >
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="isLoading"
        >
          {{ isLoading ? "Logging in..." : "Log In" }}
        </button>

        <p v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </p>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Don't have an account?
          <a
            href="/register"
            class="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >Sign up</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      rememberMe: false,
      isLoading: false,
      errorMessage: "",
      apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5001",
    };
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await fetch(`${apiUrl}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password,
            rememberMe: this.rememberMe,
            credentials: "include",
          }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Login failed: ${response.status}`
            );
          } catch (jsonError) {
            throw new Error(
              `Login failed: ${response.statusText || response.status}`
            );
          }
        }

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }

        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage =
          error.message || "Invalid email or password. Please try again.";
        console.error("Login error:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
