<template>
  <!-- Container for individual task -->
  <div class="bg-gray-50 p-4 rounded-lg shadow-md mb-4">
    <!-- Task title -->
    <h3 class="text-xl font-semibold mb-2">{{ title }}</h3>
    <!-- Task description -->
    <p class="text-gray-600 mb-1">Description: {{ description }}</p>
    <!-- The date it was added -->
    <p class="text-gray-600 mb-1">Date Added: {{ dateAdded }}</p>
    <!-- Task deadline -->
    <p class="text-gray-600 mb-3">Deadline: {{ deadline }}</p>

    <!-- Buttons to update the status of a task, to delete and to edit -->
    <div class="flex justify-between items-center">
      <p
        :class="{ 'text-green-500': isComplete, 'text-red-500': !isComplete }"
        class="text-sm"
      >
        {{ isComplete ? "Complete" : "Incomplete" }}
      </p>
      <div>
        <button
          @click="toggleComplete"
          class="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
        >
          {{ isComplete ? "Mark Incomplete" : "Mark Complete" }}
        </button>
        <button
          @click="editTask"
          class="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
        >
          Edit
        </button>
        <button
          @click="deleteTask"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>

    <!-- Edit task section -->
    <div v-if="isEditing">
      <input
        v-model="editedTask.title"
        placeholder="Task Title"
        class="border p-2 mt-2 w-full"
      />
      <textarea
        v-model="editedTask.description"
        placeholder="Task Description"
        class="border p-2 mt-2 w-full"
      ></textarea>
      <input
        type="date"
        v-model="editedTask.deadline"
        class="border p-2 mt-2 w-full"
      />
      <div v-if="errorMessages.length" class="mt-2 text-red-500">
        <ul>
          <li v-for="(error, index) in errorMessages" :key="index">
            {{ error }}
          </li>
        </ul>
      </div>
      <div class="flex items-center justify-end mt-3">
        <button
          @click="saveEdit"
          class="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
        >
          Save
        </button>
        <button
          @click="cancelEdit"
          class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import { validateTask } from "../validation";

export default defineComponent({
  name: "Task",
  props: {
    title: String,
    description: String,
    dateAdded: String,
    deadline: String,
    isComplete: Boolean,
    taskId: Number,
  },
  emits: ["delete-task", "edit-task", "toggle-complete"],
  setup(props, { emit }) {
    const isEditing = ref(false);
    const editedTask = ref({
      title: props.title,
      description: props.description,
      deadline: props.deadline,
    });
    const errorMessages = ref([]);
    // function to update the status of a task
    const toggleComplete = () => {
      emit("toggle-complete", props.taskId);
    };

    // Function to initiate editing mode and populate the edited task data
    const editTask = () => {
      isEditing.value = true;
      editedTask.value = {
        title: props.title,
        description: props.description,
        deadline: props.deadline,
      };
      errorMessages.value = [];
    };

    // Function to save edited task
    const saveEdit = () => {
      const { isValid, errors } = validateTask(editedTask.value);
      if (isValid) {
        emit("edit-task", { ...editedTask.value, id: props.taskId });
        isEditing.value = false;
      } else {
        errorMessages.value = Object.values(errors);
      }
    };

    // Function to cancel the editing
    const cancelEdit = () => {
      isEditing.value = false;
    };

    // Function to delete the task
    const deleteTask = () => {
      emit("delete-task", props.taskId);
    };

    return {
      isEditing,
      editedTask,
      errorMessages,
      toggleComplete,
      editTask,
      saveEdit,
      cancelEdit,
      deleteTask,
    };
  },
});
</script>
