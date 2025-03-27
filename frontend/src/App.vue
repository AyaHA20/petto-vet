<template>
  <div>
    <AddPatient />
    <PatientList />
  </div>
</template>

<script>
import AddPatient from "./components/AddPatient.vue";
import PatientList from "./components/PatientList.vue";

export default {
  components: { AddPatient, PatientList },
};
</script>
