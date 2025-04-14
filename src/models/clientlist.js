const express = require('express');
const router = express.Router();
const Client = require('../models/clientlist');

// GET tous les clients ou chercher par nom si le paramètre "name" est fourni
router.get('/', async (req, res) => {
  try {
    const { name } = req.query;  // Récupérer le paramètre "name" de la requête

    let clients;
    if (name) {
      // Si un nom est fourni, rechercher les clients par nom
      clients = await Client.find({
        Nom: { $regex: name, $options: 'i' }  // Recherche insensible à la casse
      });
    } else {
      // Si aucun nom n'est fourni, renvoyer tous les clients
      clients = await Client.find();
    }

    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assure-toi d'exporter le routeur correctement
module.exports = router;
