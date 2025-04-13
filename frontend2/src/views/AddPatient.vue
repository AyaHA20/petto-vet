<template>
  <div class="add-patient-container">
    <!-- Header Section -->
    <div class="form-header">
      <div class="photo-upload" @click="triggerFileInput">
        <img v-if="!previewImage" src="@/assets/AddPatient/addphoto.png" alt="Add Photo" class="upload-icon">
        <img v-else :src="previewImage" alt="Patient Photo" class="patient-photo">
        <input 
          type="file" 
          ref="fileInput" 
          @change="handleFileUpload" 
          accept="image/*" 
          hidden
        >
      </div>
      <div class="header-text">
        <h2>{{ isEditMode ? 'Edit Patient' : 'Add Patient' }}</h2>
        <p>Fill in the details below to {{ isEditMode ? 'update' : 'add a new' }} patient and keep their care on track</p>
      </div>
      <img src="@/assets/AddPatient/tortue.gif" alt="Turtle" class="turtle-icon">
    </div>

    <!-- Patient Form -->
    <form @submit.prevent="submitForm" class="patient-form">
      <!-- Pet Information -->
      <div class="form-group">
        <label for="petName">Pet Name *</label>
        <input 
          id="petName"
          type="text" 
          v-model="formData.petName" 
          required
          placeholder="e.g. Max"
          :class="{ 'error-field': errors.petName }"
          @blur="validateField('petName')"
        >
        <span class="error-message" v-if="errors.petName">{{ errors.petName }}</span>
      </div>

      <div class="form-group">
        <label for="ownerName">Owner Name *</label>
        <input 
          id="ownerName"
          type="text" 
          v-model="formData.ownerName" 
          required
          placeholder="Owner's full name"
          :class="{ 'error-field': errors.ownerName }"
          @blur="validateField('ownerName')"
        >
        <span class="error-message" v-if="errors.ownerName">{{ errors.ownerName }}</span>
      </div>

      <div class="form-group">
        <label for="ownerContact">Owner Contact *</label>
        <input 
          id="ownerContact"
          type="tel"
          class="form-input"
          v-model="formData.ownerContact"
          required
          placeholder="phone number 0(5)(6)(7)......."
          :class="{ 'error-field': errors.ownerContact }"
          @blur="validateField('ownerContact')"
        >
        <span class="error-message" v-if="errors.ownerContact">{{ errors.ownerContact }}</span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="age">Age</label>
          <input 
            id="age"
            type="number" 
            v-model="formData.age" 
            min="0"
            placeholder="0"
          >
          <span class="input-unit">years</span>
        </div>
      </div>

      <div class="form-group">
        <label for="birthDate">Birthday/Adoption Date</label>
        <input 
          id="birthDate"
          type="date" 
          v-model="formData.birthDate"
          @change="calculateAgeFromDate"
        >
      </div>

 <div class="form-group">
  <label for="species">Species</label>
  <input 
    id="species"
    list="species-options"
    v-model="formData.species"
    required
    :class="{ 'error-field': errors.species }"
    @change="validateField('species')"
    placeholder="Select or enter species"
  />
  <datalist id="species-options">
    <option value="Dog"></option>
    <option value="Cat"></option>
    <option value="Bird"></option>
    <option value="Rabbit"></option>
    <option value="Other"></option>
  </datalist>
  <span class="error-message" v-if="errors.species">{{ errors.species }}</span>
</div>




      <div class="form-group">
        <label for="breed">Breed</label>
        <input 
          id="Breed"
          type="text" 
          v-model="formData.breed" 
          placeholder="e.g. Golden Retriever"
          list="breedOptions"
        >
        <datalist id="breedOptions">
          <option v-for="breed in breedOptions" :key="breed" :value="breed"></option>
        </datalist>
      </div>

      <div class="form-group">
        <label for="gender">Gender</label>
        <div class="gender-options">
          <label>
            <input type="radio" v-model="formData.gender" value="Male"> Male
          </label>
          <label>
            <input type="radio" v-model="formData.gender" value="Female"> Female
          </label>
        </div>
        <span class="error-message" v-if="errors.gender">{{ errors.gender }}</span>
      </div>

      <div class="form-group">
        <label for="medicalIssues">Medical Issues</label>
        <textarea 
          id="medicalIssues"
          v-model="formData.medicalIssues" 
          placeholder="Any known health problems or allergies"
          rows="3"
        ></textarea>
      </div>

    

      <div class="form-actions">
        <button type="submit" class="submit-btn" :disabled="isSubmitting">
          <span v-if="isSubmitting">
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            Saving...
          </span>
          <span v-else>{{ isEditMode ? 'Save Changes' : 'Add Patient' }}</span>
        </button>
        
        <button 
          v-if="isEditMode" 
          @click="cancelEdit" 
          type="button"
          class="cancel-btn"
        >
          Cancel
        </button>
      </div>
    </form>

    <!-- Success Notification -->
    <div v-if="showSuccess" class="notification success">
      {{ isEditMode ? 'Patient updated successfully!' : 'Patient added successfully!' }}
      <button @click="showSuccess = false" class="close-notification">×</button>
    </div>

    <!-- Error Notification -->
    <div v-if="showError" class="notification error">
      {{ errorMessage }}
      <button @click="showError = false" class="close-notification">×</button>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, reactive, watch, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const fileInput = ref(null)
const isSubmitting = ref(false)
const showSuccess = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const breedOptions = ref([])
const API_URL = 'http://localhost:5000/patients'

const props = defineProps({
  patientToEdit: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save-patient', 'cancel'])

const isEditMode = computed(() => !!props.patientToEdit)

// Form data structure - NOMS INTERNES RESTENT IDENTIQUES pour la liaison v-model
const formData = reactive({
  petName: '',
  ownerName: '',
  ownerContact: '',
  age: null,
  gender: '',
  birthDate: '',
  species: '',
  breed: '',
  medicalIssues: '',
  createdAt: new Date().toISOString().split('T')[0],
  photo: null
})

const errors = reactive({
  petName: '',
  ownerName: '',
  ownerContact: '',
  species: ''
})

const previewImage = ref(null)

// Initialisation du formulaire en mode édition
onMounted(() => {
  if (isEditMode.value) {
    formData.petName = props.patientToEdit.name // 'pet_name' devient 'name'
    formData.ownerName = props.patientToEdit.ownername // 'owner_name' devient 'ownername'
    formData.ownerContact = props.patientToEdit.owner_contact || ''
    formData.age = props.patientToEdit.age
    formData.gender = props.patientToEdit.sex
    formData.species = props.patientToEdit.species
    formData.breed = props.patientToEdit.race || '' // 'breed' devient 'race'
    formData.medicalIssues = props.patientToEdit.medical_issue || '' // 'medicalIssues' devient 'medical_issue'
    formData.birthDate = props.patientToEdit.birthday_ownerday || '' // 'birthDate' devient 'birthday_ownerday'
    formData.createdAt = props.patientToEdit.created_at || new Date().toISOString().split('T')[0]
  }
})

// Watch species change to load breeds
watch(() => formData.species, (species) => {
  if (species) {
    loadBreeds(species)
  }
})

// Handle photo upload
const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileUpload = (e) => {
  const file = e.target.files[0]
  if (!file) return

  if (!file.type.match('image.*')) {
    showErrorNotification('Please select an image file (JPEG, PNG)')
    return
  }

  if (file.size > 2 * 1024 * 1024) {
    showErrorNotification('Image size should be less than 2MB')
    return
  }

  formData.photo = file
  previewImage.value = URL.createObjectURL(file)
}

// Form validation
const validateField = (field) => {
  switch (field) {
    case 'petName':
      errors.petName = formData.petName.trim() ? '' : 'Pet name is required'
      break
    case 'ownerName':
      errors.ownerName = formData.ownerName.trim() ? '' : 'Owner name is required'
      break
    case 'ownerContact':
      errors.ownerContact = /^\+?[\d\s-]{8,}$/.test(formData.ownerContact) 
        ? '' 
        : 'Please enter a valid phone number'
      break  
    case 'species':
      errors.species = formData.species ? '' : 'Please select a species'
      break
      case 'gender':
      errors.gender = formData.gender ? '' : 'Please select a gender'
      break
  }
}

const validateForm = () => {
  validateField('petName')
  validateField('ownerName')
  validateField('species')
  validateField('ownerContact')
  validateField('gender')
  return !errors.petName && !errors.ownerName && !errors.species && !errors.ownerContact && !errors.gender
}

// Calculate age from birth date
const calculateAgeFromDate = () => {
  if (formData.birthDate) {
    const birthDate = new Date(formData.birthDate)
    const diff = Date.now() - birthDate.getTime()
    const ageDate = new Date(diff)
    formData.age = Math.abs(ageDate.getUTCFullYear() - 1970)
  }
}

// Load breeds based on species
const loadBreeds = async (species) => {
  try {
    const breedData = {
      Dog: ['Labrador', 'Golden Retriever', 'German Shepherd'],
      Cat: ['Siamese', 'Persian', 'Maine Coon'],
      Bird: ['Parrot', 'Canary', 'Cockatiel'],
      Rabbit: ['Dutch', 'Lionhead', 'Flemish Giant'],
      Other: []
    }
    breedOptions.value = breedData[species] || []
  } catch (error) {
    console.error('Error loading breeds:', error)
  }
}

// Notifications
const showSuccessNotification = () => {
  showSuccess.value = true
  setTimeout(() => showSuccess.value = false, 5000)
}

const showErrorNotification = (message) => {
  errorMessage.value = message
  showError.value = true
  setTimeout(() => showError.value = false, 5000)
}



// Form submission
// Dans la méthode submitForm, remplacez tout par :
const submitForm = async () => {
  try {
    // 1. Créer FormData au lieu de JSON
    const formPayload = new FormData();
    
    // Ajouter tous les champs texte
    formPayload.append('name', formData.petName);
    formPayload.append('ownername', formData.ownerName);
    formPayload.append('owner_contact', formData.ownerContact);
    formPayload.append('species', formData.species);
    formPayload.append('sex', formData.gender);
    formPayload.append('age', formData.age || '');
    formPayload.append('race', formData.breed || '');
    formPayload.append('medical_issue', formData.medicalIssues || '');
    formPayload.append('birthday_ownerday', formData.birthDate || '');

    // 2. Ajouter la photo si elle existe
    if (formData.photo) {
      formPayload.append('photo', formData.photo); // 'photo' doit matcher avec multer
    }

    // 3. Envoyer en une seule requête
    const response = await axios.post(`${API_URL}/add`, formPayload, {
      // Pas besoin de Content-Type header, axios le gère automatiquement pour FormData
    });

    if (response.data.success) {
      showSuccessNotification();
    }

  } catch (error) {
    console.error("Détails de l'erreur:", {
      URL: error.config?.url,
      Status: error.response?.status,
      Data: error.response?.data,
      Headers: error.config?.headers
    });
    showErrorNotification(error.response?.data?.message || "Erreur lors de l'envoi");
  }
};
const cancelEdit = () => {
  emit('cancel')
}
</script>

<style scoped>
.add-patient-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  position: relative;
}

.form-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.photo-upload {
  width: 100px;
  height: 100px;
  background-color: #3CB4AC;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;
  transition: transform 0.3s;
}

.photo-upload:hover {
  transform: scale(1.05);
}

.upload-icon {
  width: 40px;
  height: 40px;
}

.patient-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-text {
  flex: 1;
}

.header-text h2 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.header-text p {
  margin: 5px 0 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.turtle-icon {
  width: 80px;
  height: 80px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.patient-form {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="date"],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3CB4AC;
  box-shadow: 0 0 0 2px rgba(60, 180, 172, 0.2);
}

.error-field {
  border-color: #ff4444 !important;
}

.error-message {
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 5px;
  display: block;
}

.form-row {
  display: flex;
  gap: 20px;
}

.form-row .form-group {
  flex: 1;
}

.input-unit {
  margin-left: 8px;
  color: #7f8c8d;
  font-size: 0.8rem;
}

.gender-options {
  display: flex;
  gap: 15px;
  margin-top: 8px;
}

.gender-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: normal;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.submit-btn {
  background-color: #529597;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: background 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-btn:hover {
  background-color: #3CB4AC;
}

.submit-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.cancel-btn {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  flex: 1;
  transition: background 0.3s;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

/* Spinner animation */
.spinner {
  width: 20px;
  height: 20px;
  animation: rotate 2s linear infinite;
}

.spinner .path {
  stroke: white;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% { transform: rotate(360deg); }
}

@keyframes dash {
  0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
}

/* Notifications */
.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 20px;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 300px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #f44336;
}

.close-notification {
  background: none;
  border: none;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
  margin-left: 10px;
  padding: 0 0 0 10px;
}

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .form-header {
    flex-direction: column;
    text-align: center;
  }
  
  .header-text {
    margin: 20px 0;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }

  .notification {
    width: calc(100% - 40px);
    max-width: none;
  }

  .form-actions {
    flex-direction: column;
  }

}
.form-input,
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border 0.3s;
}
</style>