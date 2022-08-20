const express = require('express'); //Importation d'express.
const router = express.Router(); //Création d'un router avec la méthode Router() d'express.

const auth = require('../middleware/auth'); //Importation du middleware auth, cela va permettre d'autentifier les requêtes de nos utilisateur.
const multer = require('../middleware/multer-config'); //Importation du middleware multer.

const sauceControllers = require('../controllers/sauce'); //Importation des controllers 'sauce'.

router.post('/', auth, multer, sauceControllers.createSauce);
router.put('/:id', auth, multer, sauceControllers.modifySauce);
router.get('/:id', auth, sauceControllers.getOneSauce);
router.get('/', auth, sauceControllers.getAllSauce);
router.delete('/:id', auth, multer, sauceControllers.deleteSauce);
router.post('/:id/like', auth, sauceControllers.createLike);

module.exports = router; //Exportation des routes.