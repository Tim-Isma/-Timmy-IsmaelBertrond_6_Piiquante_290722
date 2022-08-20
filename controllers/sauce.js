const Sauce = require('../models/Sauce'); //Importation du model 'Sauce'.

const fs = require('fs'); //Importation du module 'fs', qui va être très utiles pour accéder et interagir avec le système de fichiers.

//Middleware qui va nous permettre de créer notre Objet.
exports.createSauce = (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
      ...sauceObject,
      _userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
        .catch(error => res.status(400).json({ error }));
};

//Middleware qui va nous permettre de lire notre Objet.
exports.getOneSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => res.status(201).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

//Middleware qui va nous permettre de lire nos Objets.
exports.getAllSauce = (req, res) => {
    Sauce.find()
        .then(sauces => res.status(201).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

//Middleware qui va nous permettre de modifier notre Objet.
exports.modifySauce = (req, res) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body};

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
        } else {
            Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié !'}))
            .catch(error => res.status(401).json({ error }));
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
};

//Middleware qui va nous permettre de supprimer notre Objet.
exports.deleteSauce = (req, res) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(400).json({message: 'Not authorized'})
            } else {
                const filename = sauce.imageUrl.split('/images/') [1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                        .catch(error => res.status(401).json({ error }))
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
};

//Middleware qui va nous permettre de créer et de modifier nos likes et dislikes.
exports.createLike = (req, res) => {
    let like = req.body.like
    console.log(req.body);
    console.log(req.params);

    switch (like) {
        case 1: 
            Sauce.updateOne({ _id: req.params.id}, 
            {
                $inc: { likes: 1 },
                $push: { usersLiked: req.body.userId}
            })
        .then(() => res.status(201).json({ message: `J'aime !`}))
        .catch(error => res.status(400).json({ error }));

        break;

        case -1: 
            Sauce.updateOne({ _id: req.params.id }, 
                {
                    $inc: { dislikes: 1 },
                    $push: { usersDisliked: req.body.userId}
                })
        .then(() => res.status(201).json({ message: `Je n'aime pas !`}))
        .catch(error => res.status(400).json({ error }));

        break;

        case 0:
            Sauce.findOne({ _id: req.params.id })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { likes: -1 }, 
                                $pull: { usersLiked: req.body.userId } 
                            })
                        .then(() => res.status(201).json({ message: `Initialisation`}))
                        .catch(error => res.status(400).json({ error }));
                    }
                    if (sauce.usersDisliked.includes(req.body.userId)) {
                        Sauce.updateOne({ _id: req.params.id },
                            {
                                $inc: { dislikes: -1 }, 
                                $pull: { usersDisliked: req.body.userId }
                            })
                        .then(() => res.status(201).json({ message: `Initialisation`}))
                        .catch(error => res.status(400).json({ error }));
                    }
                })
                .catch(error => res.status(404).json({ error }));
        break;

        default:
            console.log(error);
    }
};

