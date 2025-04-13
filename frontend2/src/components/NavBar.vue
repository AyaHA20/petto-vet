<template>  
    <header class="header">
    
    <router-link to="/homePage" class="bouttonlogo">
  <span>
    <img class="logo" src="/src/assets/img/logo.png" alt="Logo">
  </span>
   </router-link>

  
      <button type="button" class="hamburgerElemnt mobile-only" @click="isMenuOpen = !isMenuOpen">
        <span v-if="isMenuOpen">
          <img src="https://img.icons8.com/ios-filled/100/f/delete-sign.png" alt="close" class="menu-icon">
        </span>
        <span v-else>
          <img src="/icons8-menu-50.png" alt="menu" class="menu-icon">
        </span>
      </button>
  
      <nav :class="['navbar', isMenuOpen ? 'visible' : 'hidden']">
        <ul>
          <li v-for="(item, index) in Menu" :key="item.name" :class="{ 'last-item': index === Menu.length - 1 }">
            <router-link 
              :to="item.href" 
              class="mon-element" 
              :class="{ active: route.path === item.href }" 
              @click="isMenuOpen = false"
            >
              <!-- Si l'élément est "Contact", on ajoute une icône avant le texte -->
               
              {{ item.name }}  
              
            </router-link>
            <!-- Si l'élément a un numéro de téléphone, on l'affiche sous le nom -->
            <div v-if="item.phoneNumber" class="phone-number">
              <span class="orange">{{ item.phoneNumber }}</span>
            </div>
          </li>
        </ul>
      </nav>
    </header>
</template>
  
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';  

const route = useRoute(); 

const Menu = ref([
  { name: 'HomePage', href: '/homePage' },
  { name: 'Add Patient', href: '/addpatient' },
  { name: 'Patient List', href: '/patientlist' },
  { name: 'Book Appointment', href: '/bookappointment' },
  { name: 'Contact', href: '#', phoneNumber: '+123 121 1234' }, 
]);

const isMenuOpen = ref(false);
</script>
  

<style>
/* Header */
.header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  position: relative;
  z-index: 20;
}

/* Logo */
.logo {
  width: 140px;
  height: 120px;
  border: none;
  background-color: white;
}
.bouttonlogo{
  border: none;
  background-color: white;
}

/* Bouton du menu (hamburger) */
.hamburgerElemnt {
  display: block;
  background: none;
  border: none;
  cursor: pointer;
  outline: none;
}

.orange{
  color: orange;
}

/* Icône du menu */
.menu-icon {
  width: 40px;
  height: 40px;
}

/* MASQUER le bouton sur desktop */
@media (min-width: 768px) {
  .mobile-only {
    display: none;
  }
}

/* Menu principal */
.navbar {
  width: 100%;
}

/* Cacher le menu sur mobile par défaut */
@media (max-width: 767px) {
  .navbar {
    display: none;
    flex-direction: column;
    align-items: center;
    background-color: #ffffff;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    padding: 5px 0;
    margin : 5px 0;
  }

  /* Si le menu est ouvert */
  .navbar.visible {
    display: flex;
  }
}

/* Distribution du menu sur Desktop */
@media (min-width: 768px) {
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

.navbar ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  justify-content: space-between; /* Ou 'space-around' */
  width: 100%;
  gap: 5px; /* Nouvelle propriété standard */
}

.navbar li {
  flex: 1 0 auto; /* Alternative à flex-grow */
  text-align: center;
  padding: 0;
  margin-left:5px; /* Utilisez margin plutôt que padding */
  min-width: max-content; /* Empêche le rétrécissement */
}

/* Pour les écrans larges */
@media (min-width: 1200px) {
  .navbar li {
  margin-left:5px;
  }
}

  /* Le dernier élément (Contact) va tout à droite */
  .navbar .last-item {
    margin-left: 0px;
    flex-grow: 0;
  }
}

/* Liens du menu */
.navbar a {
  text-decoration: none;
  color: black;
  font-size: 1.3rem;
  transition: color 0.3s ease;
}

/* Effet hover */
.navbar a:hover {
  color: orange; /* Change avec ta couleur primaire */
}

/* Style des liens */
.mon-element {
  text-decoration: none;
  color: black; /* Noir par défaut */
  font-size: 1.3rem;
  transition: color 0.3s ease;
}

/* Quand l'élément est actif */
.mon-element.active {
  color: orange; /* Orange quand actif */
  font-weight: bold;
}
 
</style> 