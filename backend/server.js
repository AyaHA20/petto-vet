require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

// Connexion à MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || "",   
  database: process.env.DB_NAME
});
console.log("DB_USER:", process.env.DB_USER); // Devrait afficher "root"
console.log("DB_PASSWORD:", process.env.DB_PASSWORD); // Devrait être vide
console.log("PORT:", process.env.PORT); // Devrait afficher 5000
db.connect(err => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err);
    return;
  }
  console.log("✅ Connecté à MySQL !");
});

// Route pour ajouter un patient
app.post("/patients", (req, res) => {
  const { name, species, race, sex, age, ownername, birthday_ownerday, medical_issue } = req.body;
  
  const sql = `INSERT INTO patients (name, species, race, sex, age, ownername, birthday_ownerday, medical_issue) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.query(sql, [name, species, race, sex, age, ownername, birthday_ownerday, medical_issue], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Patient ajouté avec succès !" });
  });
});

// Route pour récupérer tous les patients
app.get("/patients", (req, res) => {
  const sql = "SELECT * FROM patients ORDER BY created_at DESC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Lancer le serveur
app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${process.env.PORT}`);
});
