<template>
  <div class="patient-list-container">
    <h2>Patient List</h2>
    
    <div class="controls">
      <div class="sort-buttons">
        <h3>Sorted by:</h3>
        <button @click="sortBy('created_at')">Created At</button>
        <button @click="sortBy('age')">Age</button>
      </div>
      
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search by species, owner name or contact"
        class="search-bar"
      />
    </div>
    
    <table>
      <thead>
        <tr>
          <th>Pet Name</th>
          <th>Owner Name</th>
          <th>Owner Contact</th>
          <th>Age</th>
          <th>Species</th>
          <th>Created At</th>
          <th>Gender</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" 
            :key="patient.id" 
            @click="editPatient(patient)"
            class="clickable-row">
          <td>{{ patient.pet_name }}</td>
          <td>{{ patient.owner_name }}</td>
          <td>{{ patient.owner_contact }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.species }}</td>
          <td>{{ formatDate(patient.created_at) }}</td>
          <td>{{ patient.sex }}</td>
          <td>
            <div class="button-group">
              <button class="validate-btn" @click.stop="validatePatient(patient.id)">
                <img src="@/assets/patientlist/yes.png" alt="Validate">
              </button>
              <button class="delete-btn" @click.stop="deletePatient(patient.id)">
                <img src="@/assets/patientlist/no.png" alt="Delete">
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Fullscreen -->
    <div v-if="showFullscreenForm" class="fullscreen-modal">
      <div class="form-container">
        <add-patient 
          :patient-to-edit="selectedPatient"
          @save-patient="updatePatient"
          @cancel="hideEditForm"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AddPatient from './AddPatient.vue'

export default {
  components: {
    AddPatient
  },
  data() {
    return {
      patients: [],
      searchQuery: "",
      sortKey: "created_at",
      selectedPatient: null,
      showFullscreenForm: false,
      isLoading: false,
      error: null
    };
  },
  created() {
    this.fetchPatients();
  },
  computed: {
    filteredPatients() {
      return this.patients
        .filter(patient => 
          patient.species.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
          patient.owner_name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (patient.owner_contact && patient.owner_contact.includes(this.searchQuery))
        )
        .sort((a, b) => (a[this.sortKey] > b[this.sortKey] ? 1 : -1));
    }
  },
  methods: {
    async fetchPatients() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://votre-api.com/api/patients');
        this.patients = response.data;
      } catch (err) {
        console.error("Erreur de récupération des patients:", err);
        this.error = "Impossible de charger les patients";
        // Vous pourriez aussi utiliser votre système de notification ici
      } finally {
        this.isLoading = false;
      }
    },
    async deletePatient(id) {
      try {
        await axios.delete(`http://votre-api.com/api/patients/${id}`);
        this.patients = this.patients.filter(patient => patient.id !== id);
      } catch (err) {
        console.error("Erreur de suppression:", err);
        this.error = "Échec de la suppression";
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },
    sortBy(key) {
      this.sortKey = key;
    },
    validatePatient(id) {
      alert(`Patient ${id} validated!`);
    },
   
    editPatient(patient) {
      this.selectedPatient = { ...patient };
      this.showFullscreenForm = true;
      document.body.classList.add('no-scroll');
    },
    hideEditForm() {
      this.showFullscreenForm = false;
      document.body.classList.remove('no-scroll');
    },
    updatePatient(updatedPatient) {
      const index = this.patients.findIndex(p => p.id === updatedPatient.id);
      if (index !== -1) {
        this.patients.splice(index, 1, updatedPatient);
      }
      this.hideEditForm();
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

/* Fullscreen Modal Styles */
.fullscreen-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-container {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  background: white;
  border-radius: 10px;
  padding: 20px;
}

.clickable-row {
  cursor: pointer;
}

.clickable-row:hover {
  background-color: #f5f5f5;
}

.no-scroll {
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  table {
    font-size: 14px;
  }
  
  th, td {
    padding: 10px 8px;
  }
}

@media (max-width: 768px) {
  .patient-list-container {
    width: 95%;
    padding: 0 10px;
  }
  
  .controls {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .search-bar {
    width: 100%;
    box-sizing: border-box;
  }
  
  table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
    margin: 20px 0;
    font-size: 13px;
  }
  
  th, td {
    min-width: 100px; /* Empêche le rétrécissement excessif */
  }
  
  .button-group {
    flex-direction: column;
    gap: 5px;
  }
}

@media (max-width: 480px) {
  table {
    font-size: 12px;
  }
  
  th, td {
    padding: 8px 5px;
  }
  
  .sort-buttons {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .sort-buttons h3 {
    margin-bottom: 5px;
  }
  
  .fullscreen-modal .form-container {
    width: 95%;
    padding: 15px;
  }
}
</style>