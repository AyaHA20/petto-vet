require("dotenv").config();
const express = require("express");
const mysql = require("mysql2/promise");  // Utiliser mysql2 avec les promesses
const cors = require("cors");
const app = express();
const patientRoutes = require("./routes/patientRoutes"); // Importer les routes

// Middleware
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Connexion à MySQL
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME,
});

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("PORT:", process.env.PORT);
console.log("DB_HOST:", process.env.DB_HOST);  // Doit afficher "localhost"
// Test de la connexion à la base de données
db.getConnection()
  .then(() => {
    console.log("✅ Connecté à MySQL !");
  })
  .catch((err) => {
    console.error("Erreur de connexion à MySQL:", err);
  });


  // Add this before your routes
app.use((req, res, next) => {
  req.db = db; // Attach db to request
  next();
});
// Utiliser les routes définies dans le fichier patientRoutes.js
app.use("/patients", patientRoutes);  // Toutes les routes liées aux patients

// Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
});
// Route pour la racine
app.get("/", (req, res) => {
  res.send("Bienvenue sur l'API de PettoVet !");
});

module.exports.db = db; // Add this at the end
