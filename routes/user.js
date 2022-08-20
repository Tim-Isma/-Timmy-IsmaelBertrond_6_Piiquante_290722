const express = require('express'); //Importation d'express.
const router = express.Router(); //Création d'un router avec la méthode Router() d'express.

const userControllers = require('../controllers/user'); //Importation des controllers 'user'.

router.post('/signup', userControllers.signup);
router.post('/login', userControllers.login);

module.exports = router; //Exportation des routes.


