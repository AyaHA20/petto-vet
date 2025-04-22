<template>
  <div class="patient-list-container">
   <h2 style="text-align: center;">
  <span style="display: inline-flex; align-items: center; gap: 10px;">
    Patient List
    <img src="/src/assets/img/salta3.gif" alt="PettoVet Logo" style="height: 2em;">
  </span>
</h2>
      
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
        </tr>
      </thead>
      <tbody>
        <tr v-for="patient in filteredPatients" 
            :key="patient.id">
          <td>{{ patient.pet_name }}</td>
          <td>{{ patient.owner_name }}</td>
          <td>{{ patient.owner_contact }}</td>
          <td>{{ patient.age }}</td>
          <td>{{ patient.species }}</td>
          <td>{{ formatDate(patient.created_at) }}</td>
          <td>{{ patient.sex }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      patients: [],
      searchQuery: "",
      sortKey: "created_at",
      isLoading: false,
      error: null
    };
  },
  created() {
    this.fetchPatients();
  },
  computed: {
    filteredPatients() {
      const query = this.searchQuery.toLowerCase();
      return this.patients.filter(patient => {
        return (
          patient.species?.toLowerCase().includes(query) ||
          patient.owner_name?.toLowerCase().includes(query) ||
          patient.owner_contact?.toString().includes(query)
        );
      }).sort((a, b) => (a[this.sortKey] > b[this.sortKey] ? 1 : -1));
    }
  },
  methods: {
    async fetchPatients() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:5000/patients/list');
        this.patients = response.data;
      } catch (err) {
        console.error("Erreur de récupération des patients:", err);
        this.error = "Impossible de charger les patients";
      } finally {
        this.isLoading = false;
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' }
      return new Date(dateString).toLocaleDateString(undefined, options)
    },

    sortBy(key) {
      this.sortKey = key;
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
    min-width: 100px;
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
}

.title-container {
  display: flex;
  justify-content: center;
  width: 100%;
}

.centered-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.title-image img {
  height: 1em;
  width: auto;
  vertical-align: middle;
}
</style>