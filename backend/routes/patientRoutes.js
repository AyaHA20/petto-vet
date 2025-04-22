const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const multer = require('multer');
const { body } = require('express-validator');
const path = require('path');

//  multer confugiration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // file of photos
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

//  route for add methode
router.post('/add', [

  
  
  upload.single('photo'),

 
  patientController.addPatientHandler
]);


 
 
//  route for affiche methode
router.get('/list', patientController.getPatients);

// Route  for affiche by id 
router.get('/:id', patientController.getPatientById);

 
module.exports = router;
