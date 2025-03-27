<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const patients = ref([]);

const fetchPatients = async () => {
  try {
    const res = await axios.get("http://localhost:5000/patients");
    patients.value = res.data;
  } catch (error) {
    console.error("Erreur de récupération des patients :", error);
  }
};

onMounted(fetchPatients);
</script>

<template>
  <div>
    <h2>Liste des patients 🐶🐱</h2>
    <ul v-if="patients.length">
      <li v-for="patient in patients" :key="patient.id">
        <strong>{{ patient.name }}</strong> ({{ patient.species }}) - Âge : {{ patient.age }} ans
      </li>
    </ul>
    <p v-else>Aucun patient enregistré.</p>
  </div>
</template>
