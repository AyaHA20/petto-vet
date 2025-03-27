<template>
  <div>
    <h2>Ajouter un patient</h2>
    <form @submit.prevent="addPatient">
      <input v-model="patient.name" placeholder="Nom du patient" required />
      <input v-model="patient.species" placeholder="Espèce" required />
      <input v-model="patient.race" placeholder="Race" required />
      <input v-model="patient.sex" placeholder="Sexe" required />
      <input type="number" v-model="patient.age" placeholder="Âge" required />
      <input v-model="patient.ownername" placeholder="Nom du propriétaire" required />
      <input type="date" v-model="patient.birthday_ownerday" required />
      <input v-model="patient.medical_issue" placeholder="Problème médical" />
      <button type="submit">Ajouter</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patient: {
        name: "",
        species: "",
        race: "",
        sex: "",
        age: "",
        ownername: "",
        birthday_ownerday: "",
        medical_issue: "",
      },
    };
  },
  methods: {
    async addPatient() {
      try {
        await axios.post("http://localhost:5000/patients", this.patient);
        alert("✅ Patient ajouté !");
        this.patient = {}; // Réinitialiser le formulaire
      } catch (error) {
        console.error("Erreur :", error);
      }
    },
  },
};
</script>
 