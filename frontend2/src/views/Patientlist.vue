<template>
  <div class="patient-list-container">
    <h2>Patient List</h2>
    
    <div class="controls">
      <div class="sort-buttons">
        <h3>Sorted by:</h3>
        <button @click="sortBy('created_at')">Created_at</button>
        <button @click="sortBy('age')">Age</button>
      </div>
      
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by species or owner name"
        class="search-bar"
      />
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Pet Name</th>
          <th>Owner Name</th>
          <th>Pet Age</th>
          <th>Species</th>
          <th>Sex</th>
          <th>Up/Delete</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" :key="patient.id" @click="editPatient(patient)" style="cursor: pointer">
          <td>{{ patient.pet_name }}</td>
          <td>{{ patient.owner_name }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.species }}</td>
          <td>{{ patient.sex }}</td>
          <td>
            <div class="button-group">
              <button class="validate-btn" @click.stop="validatePatient(patient.id)">
                <img src="@/assets/patientlist/yes.png">
              </button>
              <button class="delete-btn" @click.stop="deletePatient(patient.id)">
                <img src="@/assets/patientlist/no.png">
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <add-patient 
      v-if="showEditForm" 
      :patient-to-edit="selectedPatient" 
      @save-patient="updatePatient"
      @cancel="cancelEdit"
      class="modifier-formulaire-affichee"
    />
  </div>
</template>

<script>
import AddPatient from './AddPatient.vue'
import { ref } from 'vue'

export default {
  components: {
    AddPatient
  },
  data() {
    return {
      patients: [
        { id: 1, pet_name: "Bella", owner_name: "Alice", age: 3, species: "Dog", sex: "Female", created_at: "2024-03-29" },
        { id: 2, pet_name: "Max", owner_name: "John", age: 5, species: "Cat", sex: "Male", created_at: "2024-03-28" },
      ],
      searchQuery: "",
      sortKey: "created_at",
      selectedPatient: null,
      showEditForm: false
    };
  },
  computed: {
    filteredPatients() {
      return this.patients
        .filter(patient => 
          patient.species.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          patient.owner_name.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .sort((a, b) => (a[this.sortKey] > b[this.sortKey] ? 1 : -1));
    }
  },
  methods: {
    sortBy(key) {
      this.sortKey = key;
    },
    validatePatient(id) {
      alert(`Patient ${id} validated!`);
    },
    deletePatient(id) {
      this.patients = this.patients.filter(patient => patient.id !== id);
      if (this.selectedPatient && this.selectedPatient.id === id) {
        this.selectedPatient = null;
      }
    },
    editPatient(patient) {
      this.selectedPatient = { ...patient };
      this.showEditForm = true;
    },
    updatePatient(updatedPatient) {
      const index = this.patients.findIndex(p => p.id === updatedPatient.id);
      if (index !== -1) {
        this.patients.splice(index, 1, updatedPatient);
      }
      this.cancelEdit();
    },
    cancelEdit() {
      this.showEditForm = false;
      this.selectedPatient = null;
    }
  }
};
</script>

<style>
.patient-list-container {
  width: 90%;
  margin: auto;
  text-align: center;
  font-family: Arial, sans-serif;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.sort-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.sort-buttons h3 {
  font-size: 18px;
  margin: 0;
  font-weight: bold;
}

.sort-buttons button {
  padding: 8px 15px;
  background: #1e9c92;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  font-weight: bold;
  transition: 0.3s;
}

.sort-buttons button:hover {
  background: #14786e;
}

.search-bar {
  padding: 8px;
  width: 250px;
  border-radius: 20px;
  border: 1px solid #ccc;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin: 30px;
}

th,
td {
  padding: 15px;
  border-bottom: 1px solid #ddd;
  text-align: center;
}

th {
  background: #f8f8f8;
  font-size: 16px;
  text-transform: uppercase;
}

tbody tr {
  background: #ffffff;
}

tbody tr:hover {
  background: #f9f9f9;
}

.button-group {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
}

.validate-btn,
.delete-btn {
  border: none;
  padding: 7px 12px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  transition: 0.3s;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.validate-btn img,
.delete-btn img {
  max-width: 100%;
  height: auto;
  width: 24px;
}


</style>