const path = require("path");
const fs = require("fs");
const { body, validationResult } = require('express-validator');
const multer = require('multer');

// photo security with multer 
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

// add with validation
 
exports.addPatientHandler = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
    return res.status(400).json({ errors: errors.array() });
  }

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
  } = req.body;

  const photo_path = req.file ? req.file.filename : null;
  console.log(name)

  try {
    // Check if patient already exists
    const [existingPatient] = await req.db.query(
      'SELECT id FROM patients WHERE name = ? AND ownername = ?',
      [name, ownername]
    );

    if (existingPatient.length > 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: "Ce patient existe déjà" });
    }

    // Insert requast
    const sql = `INSERT INTO patients (
      name, species, race, sex, age, ownername, owner_contact, 
      birthday_ownerday, medical_issue, photo_path
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const [results] = await req.db.query(sql, [
      name, species, race, sex, age, ownername, 
      owner_contact, birthday_ownerday, medical_issue, photo_path
    ]);

    res.status(201).json({ message: "Patient ajouté avec succès" });

  } catch (err) {
    if (req.file) fs.unlinkSync(path.join('uploads', req.file.filename));
    console.error("Erreur lors de l'ajout :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

 

// Récupérer les patients avec tri
exports.getPatients = async (req, res) => {
  const { sortBy, search } = req.query;
  
  // tri
  const validSortFields = ["created_at", "age", "name", "ownername"];
  const orderField = validSortFields.includes(sortBy) ? sortBy : "created_at";
  
   
  let sql = `
    SELECT 
      id,
      name AS pet_name,
      ownername AS owner_name,
      owner_contact,
      age,
      species,
      race,
      sex,
      medical_issue,
      photo_path,
      DATE_FORMAT(created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
      DATE_FORMAT(birthday_ownerday, '%Y-%m-%d') AS birthday_ownerday
    FROM patients 
  `;

  // recherhce
  const queryParams = [];
  if (search) {
    sql += ` WHERE name LIKE ? OR ownername LIKE ? OR owner_contact LIKE ?`;
    queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  // add tri
  sql += ` ORDER BY ${orderField} DESC`;

  try {
    const [results] = await req.db.query(sql, queryParams);
    
    res.status(200).json(results);
    
  } catch (err) {
    console.error("Erreur lors de la récupération des patients :", err);
    res.status(500).json({ 
      error: "Erreur serveur",
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// patient by id
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

 