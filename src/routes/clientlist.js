const express = require('express');
const router = express.Router();
const Client = require('../models/clientmodel');

router.get('/', async (req, res) => {
  try {
    const { name, statut } = req.query;
    let filter = {}; // Initialisation de l'objet filter

    // Si un statut est spécifié, on applique le filtre sur Statut
    if (statut !== undefined) {
      filter.Statut = statut === 'true'; // Si statut est 'true', on filtre sur true, sinon false
    }

    // Si un nom est spécifié, on applique un filtre supplémentaire sur le nom
    if (name) {
      filter.Nom = { $regex: name, $options: 'i' }; // Filtrage par nom avec recherche insensible à la casse
    }

    console.log("🔍 Filtre utilisé :", filter);

    const clients = await Client.find(filter); // Récupération des clients avec le filtre
    res.json(clients); // Réponse avec les clients filtrés
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
 