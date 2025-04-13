const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const multer = require('multer');
const { body } = require('express-validator');

// Configuration de Multer pour sécuriser l'upload des photos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Dossier où enregistrer les fichiers
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname).toLowerCase();
    const fileName = Date.now() + fileExtension;
    cb(null, fileName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.jpg', '.jpeg', '.png']; // Types d'images autorisés
  const fileExtension = path.extname(file.originalname).toLowerCase();

  if (!allowedTypes.includes(fileExtension)) {
    return cb(new Error('Type de fichier non autorisé'), false); // Refuser les fichiers non autorisés
  }
  cb(null, true); // Accepter les fichiers valides
};

const upload = multer({ storage, fileFilter });

// Route pour ajouter un patient avec validation des champs
router.post('/add', [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('age').isInt({ min: 0 }).withMessage('L\'âge doit être un nombre valide'),
  body('species').notEmpty().withMessage('L\'espèce est requise'),
  body('ownername').notEmpty().withMessage('Le nom du propriétaire est requis'),
  upload.single('photo')
], async (req, res) => {
  try {
    const { name, ownername } = req.body;

    // 1. Vérifier si le patient existe déjà
    const [existingPatient] = await req.db.query(
      'SELECT id FROM patients WHERE name = ? AND ownername = ?',
      [name, ownername]
    );

    if (existingPatient) {
      // Supprimer la photo uploadée si elle existe
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ error: "Ce patient existe déjà" });
    }

    // 2. Ajouter le patient s'il n'existe pas
    const result = await patientController.addPatient(req, res);

  } catch (err) {
    console.error('Erreur:', err);
    if (req.file) fs.unlinkSync(req.file.path); // Nettoyage de la photo
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

 
// Route pour mettre à jour un patient avec validation des champs
router.put('/update/:id', [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('age').isInt({ min: 0 }).withMessage('L\'âge doit être un nombre valide et supérieur ou égal à 0'),
  body('species').notEmpty().withMessage('L\'espèce est requise'),
  body('ownername').notEmpty().withMessage('Le nom du propriétaire est requis'),
  upload.single('photo') // Middleware Multer pour l'upload de photo
], patientController.updatePatient);
// Route pour récupérer la liste des patients (triée selon un critère)
router.get('/list', patientController.getPatients);

// Route pour récupérer un patient par son ID
router.get('/:id', patientController.getPatientById);

// Route pour supprimer un patient (et sa photo)
router.delete('/delete/:id', patientController.deletePatient);

module.exports = router;
