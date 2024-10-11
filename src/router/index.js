import { createRouter, createWebHistory } from "vue-router";
import Home from "../components/Home.vue";
import ToDoList from "../components/ToDoList.vue";

const routes = [
  { path: "/", name: "home", component: Home },
  { path: "/todolist", name: "todolist", component: ToDoList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
