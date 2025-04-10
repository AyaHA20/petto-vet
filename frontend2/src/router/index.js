import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '@/views/HomePage.vue';
import AddPatient from '@/views/AddPatient.vue';  // Import de la nouvelle page
import Patientlist from '@/views/Patientlist.vue';  // Import de la nouvelle page
import BookAppointment from '@/views/BookAppointment.vue'; 
const routes = [
  { path: '/', redirect: '/homePage' },
  { path: '/homePage', component: HomePage },
  { path: '/addpatient', component: AddPatient },  // Nouvelle route About Me
  { path: '/patientlist', component: Patientlist },  // Nouvelle route Skills 
  { path: '/bookappointment', component: BookAppointment },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
