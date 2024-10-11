<template>
  <!-- Main container -->
  <main class="min-h-screen bg-gray-100 flex justify-center items-center p-4">
    <div class="bg-white shadow-lg rounded-lg p-6 w-full max-w-6xl">
      <!-- Header section containing the app title and add task button -->
      <header class="flex justify-between items-center border-b pb-4 mb-4">
        <router-link
          to="/"
          class="text-3xl font-bold text-gray-800 hover:underline"
        >
          To-Do List
        </router-link>
        <button
          @click="openModalForAdd"
          class="bg-green-500 text-white px-4 py-2 rounded shadow hover:bg-green-600 transition"
        >
          + Add Task
        </button>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Task
          v-for="task in tasks"
          :key="task.id"
          :title="task.title"
          :description="task.description"
          :dateAdded="task.dateAdded"
          :deadline="task.deadline"
          :isComplete="task.isComplete"
          :taskId="task.id"
          @edit-task="updateTask"
          @delete-task="deleteTask"
          @toggle-complete="toggleTaskComplete"
        />
      </div>

      <!-- Summary of tasks: completed and total -->
      <div class="mt-6 flex justify-between">
        <p class="text-lg font-semibold">
          Completed Tasks: {{ completedTasks }}
        </p>
        <p class="text-lg font-semibold">Total Tasks: {{ totalTasks }}</p>
      </div>
    </div>

    <!-- Modal for adding or editing tasks -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white w-full max-w-4xl p-10 rounded-lg shadow-lg">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-bold">Add New Task</h3>
          <button
            @click="closeModal"
            class="text-3xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div>
          <!-- Input fields for task details -->
          <div class="mb-4">
            <label for="title" class="block text-sm font-medium text-gray-700"
              >Title</label
            >
            <input
              id="title"
              v-model="newTask.title"
              type="text"
              class="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task title"
            />
          </div>

          <div class="mb-4">
            <label
              for="description"
              class="block text-sm font-medium text-gray-700"
              >Description</label
            >
            <textarea
              id="description"
              v-model="newTask.description"
              class="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter task description"
            ></textarea>
          </div>

          <div class="mb-4">
            <label
              for="deadline"
              class="block text-sm font-medium text-gray-700"
              >Deadline</label
            >
            <input
              id="deadline"
              v-model="newTask.deadline"
              type="date"
              class="mt-1 block w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div v-if="errorMessages.length" class="mt-2 text-red-500">
          <ul>
            <li v-for="(error, index) in errorMessages" :key="index">
              {{ error }}
            </li>
          </ul>
        </div>

        <div class="flex justify-end mt-4">
          <!-- Buttons for canceling and saving changes -->
          <button
            @click="closeModal"
            class="bg-red-400 text-white px-4 py-2 rounded mr-2 hover:bg-red-500 transition"
          >
            Cancel
          </button>
          <button
            @click="validateAndAddTask()"
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
          >
            Add Task
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import Task from "./Task.vue";
import { validateTask } from "@/validation";

export default {
  name: "Todolist",
  components: {
    Task,
  },
  setup() {
    const isModalOpen = ref(false);
    const isEditing = ref(false);
    const newTask = ref({
      title: "",
      description: "",
      deadline: "",
      isComplete: false,
    });

    const tasks = ref([]);
    const errorMessages = ref([]);

    // Function to save tasks in localStorage
    const saveTasksToLocalStorage = () => {
      localStorage.setItem("tasks", JSON.stringify(tasks.value));
    };

    // Function to load tasks from localStorage
    const loadTasksFromLocalStorage = () => {
      const savedTasks = localStorage.getItem("tasks");
      if (savedTasks) {
        tasks.value = JSON.parse(savedTasks);
      } else {
        tasks.value = [
          {
            id: 1,
            title: "Task 1",
            description: "Description for task 1",
            dateAdded: "2024-10-07",
            deadline: "2024-10-15",
            isComplete: false,
          },
          {
            id: 2,
            title: "Task 2",
            description: "Description for task 2",
            dateAdded: "2024-10-08",
            deadline: "2024-10-16",
            isComplete: true,
          },
          {
            id: 3,
            title: "Task 3",
            description: "Description for task 3",
            dateAdded: "2024-10-11",
            deadline: "2024-10-17",
            isComplete: false,
          },
          {
            id: 4,
            title: "Task 4",
            description: "Description for task 4",
            dateAdded: "2024-10-11",
            deadline: "2024-10-17",
            isComplete: false,
          },
        ];
        saveTasksToLocalStorage();
      }
    };

    // Function to open modal for adding a new task
    const openModalForAdd = () => {
      isModalOpen.value = true;
      errorMessages.value = [];
    };

    // Validate and add a new task
    const validateAndAddTask = () => {
      const { isValid, errors } = validateTask(newTask.value);
      if (isValid) {
        addTask();
      } else {
        errorMessages.value = Object.values(errors);
      }
    };

    // Function to add a new task
    const addTask = () => {
      const taskToAdd = {
        id: Date.now(),
        title: newTask.value.title,
        description: newTask.value.description,
        dateAdded: new Date().toISOString().split("T")[0],
        deadline: newTask.value.deadline,
        isComplete: false,
      };
      tasks.value.push(taskToAdd);
      saveTasksToLocalStorage();
      closeModal();
    };

    // Function to update an existing task
    const updateTask = (updatedTask) => {
      const taskIndex = tasks.value.findIndex(
        (task) => task.id === updatedTask.id
      );
      if (taskIndex !== -1) {
        tasks.value[taskIndex] = { ...tasks.value[taskIndex], ...updatedTask };
        saveTasksToLocalStorage();
      }
      closeModal();
    };

    // Function to delete a task
    const deleteTask = (taskId) => {
      tasks.value = tasks.value.filter((task) => task.id !== taskId);
      saveTasksToLocalStorage();
    };

    // Function to toggle the completion status of a task
    const toggleTaskComplete = (taskId) => {
      const task = tasks.value.find((task) => task.id === taskId);
      if (task) {
        task.isComplete = !task.isComplete;
      }
      saveTasksToLocalStorage();
    };

    // Function to close the modal
    const closeModal = () => {
      isModalOpen.value = false;
      newTask.value = {
        title: "",
        description: "",
        deadline: "",
        isComplete: false,
      };
      errorMessages.value = [];
    };

    const totalTasks = computed(() => tasks.value.length);
    const completedTasks = computed(
      () => tasks.value.filter((task) => task.isComplete).length
    );
    onMounted(loadTasksFromLocalStorage);
    return {
      isModalOpen,
      isEditing,
      newTask,
      tasks,
      openModalForAdd,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      closeModal,
      totalTasks,
      completedTasks,
      validateAndAddTask,
      errorMessages,
    };
  },
};
</script>
