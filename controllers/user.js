const bcrypt = require('bcrypt'); //Importation du package de chiffrement 'bcrypt', il va nous permettre de hasher les mots de passe utilisateur.
const jwt = require('jsonwebtoken'); //Importation du package 'jsonwebtoken', il va nous permettre de pouvoir créer et vérifier les tokens d'authentification.

const User = require('../models/User'); //Importation du model 'User'.

//Middleware qui va nous permettre de créer des comptes utilisateur sécurisé.
exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

//Middleware qui va nous permettre de nous connecter à des comptes utilisateur de façon sécurisé.
exports.login = (req, res) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' })
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};