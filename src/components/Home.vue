<template>
  <!-- Main container -->
  <div class="flex items-center justify-center h-screen bg-gray-200">
    <div class="bg-white shadow-lg rounded-lg p-24 max-w-6xl w-full">
      <!-- Welcome message -->
      <h1 class="text-5xl font-bold text-center mt-4 text-green-500">
        Welcome to our To-Do App!
      </h1>
      <img
        src="https://cdn-icons-png.flaticon.com/512/7692/7692809.png"
        alt="To-Do Application"
        class="w-64 h-auto object-contain rounded-t-lg mx-auto mt-8 mb-8"
      />
      <!-- Description of the application -->
      <h5 class="text-2xl text-gray-600 text-center mt-2">
        This application helps you manage your tasks efficiently. Start by
        navigating to your to-do list and stay organized!
      </h5>
      <!-- Button that directs the user to the to-do list -->
      <div class="flex justify-center mt-8">
        <router-link
          to="/todolist"
          class="px-6 py-3 bg-green-500 text-white rounded shadow hover:bg-green-600 transition duration-300"
        >
          Go to To-Do List
        </router-link>
      </div>
    </div>
  </div>
</template>

<script></script>
