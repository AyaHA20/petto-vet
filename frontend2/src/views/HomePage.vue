<template>
  <div class="section-container">
    <!-- Première section : Image à gauche, texte à droite -->
    <div class="section">
      <img src="@/assets/homepage-icon/dog-home.png" alt="Chien heureux" class="section-image1" />
      <div class="section-text1">
        <h3 class="pink">Kawaii pets, happy vets</h3>
        <h2>From <span class="orange">MEOW</span> to <span class="orange">WOOF</span>
          every pet deserves a little</h2>
        <p>At PettoVet, we make pet care sugoi (すごい - amazing)! From managing patient records to keeping track of treatments, everything is easy, efficient, and as smooth as a cat's purr 🐱<3 .Because when veterinarians have the right tools, caring for furry friends becomes even more tanoshii (楽しい - fun)! 🐾</p>
          <router-link to="/addpatient" class="btn">Add a New Patient</router-link>
      </div>
    </div>

    <!-- Deuxième section : Texte à gauche, image à droite -->
    <div class="section section-reverse">
      <div class="section-text">
        <h2>Because Happy pets make happy vets</h2>
        <p>Welcome to PettoVet! Easily add, update, and track patient records...</p>
        <router-link to="/addpatient" class="btn2">Start now</router-link>
      </div>
      <img src="@/assets/homepage-icon/doctor-home.png" alt="Vétérinaire avec animaux" class="section-image2" />
    </div>

    <div class="features-container">
      <h2>We are best in :</h2>
      <div class="features-grid">
        <div class="feature-item" v-for="(feature, index) in features" :key="index">
          <div class="icon" :style="{ backgroundColor: feature.bgColor }">
            <img :src="feature.icon" :alt="feature.title" />
          </div>
          <p>{{ feature.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import manage from "@/assets/homepage-icon/we-are-best/manage.png";
import search from "@/assets/homepage-icon/we-are-best/search.png";
import upload from "@/assets/homepage-icon/we-are-best/upload.png";
import update from "@/assets/homepage-icon/we-are-best/update.png";
import uiux from "@/assets/homepage-icon/we-are-best/ui-ux.png";

export default {
  data() {
    return {
      features: [
        { title: "Patient Management", icon: manage, bgColor: "#FFB500" },
        { title: "Search & Filters", icon: search, bgColor: "#F99DC7" },
        { title: "Photo Uploads", icon: upload, bgColor: "#22B8CF" },
        { title: "Effortless Updates", icon: update, bgColor: "#FFB500" },
        { title: "Friendly UI/UX", icon: uiux, bgColor: "#F99DC7" },
      ],
    };
  },
};
</script>

<style scoped>
/* Conteneur principal */
.section-container {
  display: flex;
  flex-direction: column;
  gap: 80px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

/* Chaque section (image + texte) */
.section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 60px;
}

/* Styles communs pour texte et images */
.section-text1 {
  flex: 1;
  max-width: 50%;
  font-size: 18px;
  color: #333;
}
.section-text{
  flex: 1;
  max-width: 50%;
  font-size: 18px;
  color: #504f4f;
  margin-left: 50px;
}
.section-image1, .section-image2 {
  flex: 1;
  max-width: 50%;
  border-radius: 12px;
  object-fit: cover;
  height: auto;
}

/* Première section spécifique */
.section-image1 {
  order: -1;
}

/* Deuxième section spécifique */
.section-reverse .section-text {
  order: -1;
}

/* Boutons */
.btn, .btn2 {
  background-color: #529597;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 17px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.3s ease;
  text-decoration: none;
  display: inline-block;
  margin-top: 20px;
}

.btn:hover, .btn2:hover {
  background-color: orange;
}

.features-container {
  text-align: center;
  margin-top: 50px;
}

.features-container h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 60px;
}

.features-grid {
  display: flex;
  justify-content: space-between;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
  cursor: pointer;
}

.icon {
  width: 85px;
  height: 85px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-item:hover .icon {
  filter: brightness(1.1);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* Effets de survol spécifiques pour chaque feature */
.feature-item:nth-child(1):hover .icon {
  box-shadow: 0 4px 8px rgba(255, 181, 0, 0.4);
}

.feature-item:nth-child(2):hover .icon {
  box-shadow: 0 4px 8px rgba(249, 157, 199, 0.4);
}

.feature-item:nth-child(3):hover .icon {
  box-shadow: 0 4px 8px rgba(34, 184, 207, 0.4);
}

.feature-item:nth-child(4):hover .icon {
  box-shadow: 0 4px 8px rgba(255, 181, 0, 0.4);
}

.feature-item:nth-child(5):hover .icon {
  box-shadow: 0 4px 8px rgba(249, 157, 199, 0.4);
}

.feature-item p {
  margin-top: 10px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.5s ease;
}

.feature-item:hover p {
  color: #529597;
}

.pink {
  color: rgb(247, 94, 188);
}

.orange {
  color: orange;
}

@media (max-width: 768px) {
  .section, .section-reverse {
    flex-direction: column;
  }
  
  .section-text, .section-image1, .section-image2 {
    max-width: 100%;
  }
  
  .section-reverse .section-text {
    order: initial;
  }
  
  .features-grid {
    flex-direction: column;
    gap: 30px;
  }
}
</style>