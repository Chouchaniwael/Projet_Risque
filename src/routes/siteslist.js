const express = require('express');
const router = express.Router();
const Site = require('../models/sites'); // Assure-toi que le chemin est correct

// Route GET pour récupérer les sites avec filtres facultatifs
router.get('/', async (req, res) => {
  try {
    const { clientNom, statut } = req.query;
    let filter = {}; // Initialisation de l'objet filtre

    // Filtre sur le statut
    if (statut !== undefined) {
      filter.Statut = statut === 'true'; // 'true' => true, 'false' => false
    }

    // Filtre sur le clientNom
    if (clientNom) {
      filter.ClientNom = { $regex: clientNom, $options: 'i' }; // Recherche insensible à la casse
    }

    console.log("🔍 Filtre utilisé pour sites :", filter);

    const sites = await Site.find(filter); // Chercher les sites avec le filtre
    res.json(sites);
  } catch (err) {
    console.error("❌ Erreur serveur lors de la récupération des sites :", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
