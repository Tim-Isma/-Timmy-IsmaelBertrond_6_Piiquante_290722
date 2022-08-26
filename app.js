const express = require('express'); //Importation d'express.
const mongoose = require('mongoose'); //Importation de mongoose.
const path = require('path'); //Importation du module path. 
require('dotenv').config(); //Importation dotenv qui va nous permettre d'utiliser des variables d'environnement.

const helmet = require('helmet');//Importation de Helmet. 

const sauceRoutes = require('./routes/sauce'); //Importation des routes 'sauce'.
const userRoutes = require('./routes/user'); //Importation des routes 'user'.

const app = express(); //Création de l'application express.

// Connection avec la base de donnée MongoDB.
mongoose.connect(
  process.env.SECRET_DB,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Configuration du middleware pour le CORS. 
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(helmet.xssFilter()); //Protègent contre les attaques cross-site scripting (XSS).

app.use(express.json()); //Intercepte les requêtes entrantes qui a un content-type en JSON. Les corps de nos requêtes seront en JSON

// Les principaux chemin de l'api.
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app; //Exportation de l'application.
