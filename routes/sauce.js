const express = require('express'); //Importation d'express dans notre fichier 'sauce.js' dans le dossier routes.
const router = express.Router(); //Création d'un router avec la méthode Router() d'express.

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceControllers = require('../controllers/sauce'); //Importation des controllers.

router.post('/', auth, multer, sauceControllers.createSauce);
router.put('/:id', auth, multer, sauceControllers.modifySauce);
router.get('/:id', auth, sauceControllers.getOneSauce);
router.get('/', auth, sauceControllers.getAllSauce);
router.delete('/:id', auth, multer, sauceControllers.deleteSauce);
router.post('/:id/like', auth, sauceControllers.likeDislikeSauce);



module.exports = router;