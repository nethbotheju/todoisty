<template>
  <div
    class="flex justify-center items-center min-h-screen bg-gray-50 px-4 py-12"
  >
    <div
      class="w-full max-w-md bg-white rounded-xl shadow-lg p-8 transform transition-all duration-300 hover:-translate-y-1"
    >
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-blue-500">Todoisty</h1>
        <p class="text-gray-500 mt-1">Create your account</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-6">
        <div>
          <label
            for="firstName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >First Name</label
          >
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            placeholder="Enter your first name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="lastName"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Last Name</label
          >
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            placeholder="Enter your last name"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

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
            placeholder="Create a password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label
            for="confirmPassword"
            class="block text-sm font-medium text-gray-700 mb-1"
            >Confirm Password</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            placeholder="Confirm your password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p v-if="passwordMismatch" class="text-red-500 text-sm mt-1">
            Passwords don't match
          </p>
        </div>

        <button
          type="submit"
          class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          :disabled="isLoading || passwordMismatch"
        >
          {{ isLoading ? "Registering..." : "Sign Up" }}
        </button>

        <p v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </p>
      </form>

      <div class="text-center mt-6">
        <p class="text-sm text-gray-600">
          Already have an account?
          <a
            href="/login"
            class="font-semibold text-blue-600 hover:text-blue-800 hover:underline"
            >Log in</a
          >
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Register",
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      isLoading: false,
      errorMessage: "",
      apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5001",
    };
  },
  computed: {
    passwordMismatch() {
      return this.confirmPassword && this.password !== this.confirmPassword;
    },
  },
  methods: {
    async handleRegister() {
      if (this.passwordMismatch) {
        return;
      }

      this.isLoading = true;
      this.errorMessage = "";

      try {
        const response = await fetch(`${this.apiUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            password: this.password,
          }),
        });

        if (!response.ok) {
          try {
            const errorData = await response.json();
            throw new Error(
              errorData.message || `Registration failed: ${response.status}`
            );
          } catch (jsonError) {
            throw new Error(
              `Registration failed: ${response.statusText || response.status}`
            );
          }
        }

        const data = await response.json();

        if (data.accessToken) {
          localStorage.setItem("accessToken", data.accessToken);
        }

        this.$router.push("/login");
      } catch (error) {
        this.errorMessage =
          error.message || "Registration failed. Please try again.";
        console.error("Registration error:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>
