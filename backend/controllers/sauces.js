// Import modèle des sauces
const Sauce = require('../models/sauces');

// Package FS pour la suppression
const fs = require('fs');

// Création d'un sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
    .catch(error => res.status(400).json({ error }));
};


//voire les sauces
exports.getListeSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};


//supprimer sauce
exports.supprimerSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Modifier une sauce
exports.modifSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
  Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'sauce modifié !' }))
    .catch(error => res.status(400).json({ error }));
};

// Récupération d'une sauce avec l'ID
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Like & Dislike
exports.likeSauce = (req, res, next) => {
  switch (req.body.like) {

    case 0:
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          // Verification que l'utilisateur n'a pas déjà LIKER.
          if (sauce.usersLiked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { likes: -1 },
              $pull: { usersLiked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(200).json({ message: 'Avis pris en compte !' }); })
              .catch((error) => { res.status(400).json({ error: error }); });

            // Verification que l'utilisateur n'a pas déjà DISLIKER.
          } if (sauce.usersDisliked.find(user => user === req.body.userId)) {
            Sauce.updateOne({ _id: req.params.id }, {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: req.body.userId },
              _id: req.params.id
            })
              .then(() => { res.status(200).json({ message: 'Avis pris en compte !' }); })
              .catch((error) => { res.status(400).json({ error: error }); });
          }
        })
        .catch((error) => { res.status(404).json({ error: error }); });
      break;
    //likes = 1
    case 1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { likes: 1 },
        $push: { usersLiked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(200).json({ message: 'Like pris en compte !' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    //likes = -1
    case -1:
      Sauce.updateOne({ _id: req.params.id }, {
        $inc: { dislikes: 1 },
        $push: { usersDisliked: req.body.userId },
        _id: req.params.id
      })
        .then(() => { res.status(201).json({ message: 'Dislike pris en compte !' }); })
        .catch((error) => { res.status(400).json({ error: error }); });
      break;
    default:
      console.error('fauce requête ! ');
  }
};
