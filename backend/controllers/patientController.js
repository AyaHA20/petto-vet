const path = require("path");
const fs = require("fs");
const { body, validationResult } = require('express-validator');
const multer = require('multer');

// Configuration de Multer pour sécuriser l'upload des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = Date.now() + fileExtension;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png'];
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(fileExtension)) {
    return cb(new Error('Type de fichier non autorisé'), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// Ajouter un patient avec validation des champs
exports.addPatient = [
  // Middleware Multer pour gérer l'upload de photo (si envoyée en form-data)
  upload.single('photo'), // ✅ Accepte le fichier "photo" dans form-data
  
  // Validation des champs (fonctionne pour JSON et form-data)
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('age').isInt({ min: 0 }).withMessage('L\'âge doit être un nombre valide et supérieur ou égal à 0'),
  body('species').notEmpty().withMessage('L\'espèce est requise'),
  body('ownername').notEmpty().withMessage('Le nom du propriétaire est requis'),

  async (req, res) => {
    // Gestion des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Supprime la photo uploadée si la validation échoue
      if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
      return res.status(400).json({ errors: errors.array() });
    }

    // Extraction des données (marche avec JSON ET form-data)
    const {
      name,
      species,
      race,
      sex,
      age,
      ownername,
      owner_contact,
      birthday_ownerday,
      medical_issue
    } = req.body; // ✅ Reçoit les champs depuis JSON ou form-data

    // Gestion de la photo (seulement si envoyée en form-data)
    const photo_path = req.file ? req.file.filename : null;

    // Requête SQL
    const sql = `INSERT INTO patients (
      name, species, race, sex, age, ownername, owner_contact, 
      birthday_ownerday, medical_issue, photo_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    try {
      const [results] = await req.db.query(sql, [
        name, species, race, sex, age, ownername, 
        owner_contact, birthday_ownerday, medical_issue, photo_path
      ]);
      res.status(201).json({ message: "Patient ajouté avec succès" });
    } catch (err) {
      // Supprime la photo en cas d'erreur serveur
      if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
      console.error("Erreur lors de l'ajout :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
];

// Mettre à jour un patient avec validation
exports.updatePatient = [
  // Middleware Multer pour la photo (si envoyée en form-data)
  upload.single('photo'), // ✅ Accepte le fichier "photo" dans form-data

  // Validation des champs
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('age').isInt({ min: 0 }).withMessage('L\'âge doit être un nombre valide et supérieur ou égal à 0'),
  body('species').notEmpty().withMessage('L\'espèce est requise'),
  body('ownername').notEmpty().withMessage('Le nom du propriétaire est requis'),

  async (req, res) => {
    const { id } = req.params;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
      return res.status(400).json({ errors: errors.array() });
    }

    // Extraction des données (JSON ou form-data)
    const {
      name,
      species,
      race,
      sex,
      age,
      ownername,
      owner_contact,
      birthday_ownerday,
      medical_issue
    } = req.body; // ✅ Reçoit les champs depuis JSON ou form-data

    // Gestion de la photo (seulement si envoyée en form-data)
    const photo_path = req.file ? req.file.filename : null;

    try {
      // Récupère l'ancienne photo
      const [patient] = await req.db.query("SELECT photo_path FROM patients WHERE id = ?", [id]);
      if (!patient.length) {
        if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
        return res.status(404).json({ error: "Patient introuvable" });
      }
      const oldPhoto = patient[0].photo_path;

      // Requête SQL dynamique (met à jour la photo si elle est envoyée)
      const updateSql = `
        UPDATE patients 
        SET name=?, species=?, race=?, sex=?, age=?,
            ownername=?, owner_contact=?, birthday_ownerday=?, medical_issue=?
            ${photo_path ? ", photo_path=?" : ""} 
        WHERE id=?
      `;
      const values = [
        name, species, race, sex, age,
        ownername, owner_contact, birthday_ownerday, medical_issue
      ];
      if (photo_path) values.push(photo_path);
      values.push(id);

      await req.db.query(updateSql, values);

      // Supprime l'ancienne photo si une nouvelle est uploadée
      if (photo_path && oldPhoto) {
        fs.unlink(path.join('uploads', oldPhoto), (err) => {
          if (err) console.error("Erreur suppression ancienne photo :", err);
        });
      }

      res.status(200).json({ message: "Patient mis à jour avec succès" });
    } catch (err) {
      if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
      console.error("Erreur lors de la mise à jour :", err);
      res.status(500).json({ error: "Erreur serveur" });
    }
  }
];

// Récupérer les patients avec tri
exports.getPatients = async (req, res) => {
  const { sortBy } = req.query;
  let validSortFields = ["created_at", "age"];

  const orderField = validSortFields.includes(sortBy) ? sortBy : "created_at";

  const sql = `SELECT name AS pet_name, ownername AS owner_name, age AS pet_age, species, sex FROM patients ORDER BY ${orderField} DESC`;

  try {
    const [results] = await req.db.query(sql);
    res.status(200).json(results);
  } catch (err) {
    console.error("Erreur lors de la récupération des patients :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// Récupérer un patient par ID
exports.getPatientById = async (req, res) => {
  const { id } = req.params;

  const sql = `SELECT name, species, race, sex, age, ownername, owner_contact, birthday_ownerday, medical_issue, photo_path, created_at FROM patients WHERE id = ?`;

  try {
    const [results] = await req.db.query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Patient introuvable" });
    }

    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Erreur lors de la récupération du patient :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

// Supprimer un patient et la photo associée
exports.deletePatient = async (req, res) => {
  const { id } = req.params;

  try {
    const [results] = await req.db.query("SELECT photo_path FROM patients WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Patient introuvable" });
    }

    const photo = results[0].photo_path;

    await req.db.query("DELETE FROM patients WHERE id = ?", [id]);

    // Supprimer la photo du dossier si elle existe
    if (photo) {
      const photoPath = path.join(__dirname, "../uploads", photo);
      fs.unlink(photoPath, (err) => {
        if (err) console.error("Erreur lors de la suppression de la photo :", err);
      });
    }

    res.status(200).json({ message: "Patient supprimé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la suppression :", err);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};