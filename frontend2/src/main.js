import { createApp } from 'vue';
import App from './App.vue';
import router from './router';  
import axios from "axios";

const app = createApp(App);
app.use(router); //  activation of router
app.mount('#app');

const api = axios.create({
  baseURL: "http://localhost:5000",  
  headers: {
    "Content-Type": "application/json",
  },
});