<template>
  <div class="container">
    <NavBar />
    <router-view /> <!-- C'est ici que les pages s'afficheront -->
    <Footer /> <!-- Ajout du footer -->
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue';

const NavBar = defineAsyncComponent(() => import('@/components/NavBar.vue'));
const Footer = defineAsyncComponent(() => import('@/components/Footer.vue')); // Ajout du Footer

</script>

<style>
* {
  font-family: 'Poppins', sans-serif;
}
.container {
  background-color: white;
  height: 100vh;
  width: 100%;
  overflow-x: hidden;
 
}

</style>
