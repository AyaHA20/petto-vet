import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 👈 Import du routeur
import axios from "axios";

const app = createApp(App);
app.use(router); // 👈 Activation du routeur
app.mount('#app');

const api = axios.create({
  baseURL: "http://localhost:5000", // URL de ton backend
  headers: {
    "Content-Type": "application/json",
  },
});