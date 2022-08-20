const mongoose = require('mongoose'); //Importation de mongoose.
const uniqueValidator = require('mongoose-unique-validator'); //Importation du package 'mongoose-unique-validator', cela va permettre d'assurer que deux utilisateur ne puissent pas utiliser la même adresse mail.

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //Ajout du plugin 'uniqueValidator'.

module.exports = mongoose.model('User', userSchema);