const express = require('express'); //Importation d'express dans notre fichier 'app.js'.
const mongoose = require('mongoose'); //Importation de mongoose dans notre fichier 'app.js'.
const path = require('path');

const sauceRoutes = require('./routes/sauce') //Importation des routes 'sauce' dans notre fichier 'app.js'.
const userRoutes = require('./routes/user') //Importation des routes 'user' dans notre fichier 'app.js'.

const app = express(); //On va créer une application express.

mongoose.connect('mongodb+srv://Bertrond:Acerbe!2309@cluster23.u3ckj.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

app.use(express.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));


module.exports = app; //On va exporter cette application.
