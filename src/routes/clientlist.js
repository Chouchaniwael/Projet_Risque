const express = require('express');
const router = express.Router();
const Client = require('../models/clientmodel');

// Récupérer les clients avec filtres optionnels : statut, nom, et etatarchivage
router.get('/', async (req, res) => {
  try {
    const { name, statut, etatarchivage } = req.query;
    let filter = {}; // Initialisation du filtre

    // Filtre sur le statut (booléen)
    if (statut !== undefined) {
      filter.Statut = statut === 'true';
    }

    // Filtre sur le nom (regex insensible à la casse)
    if (name) {
      filter.Nom = { $regex: name, $options: 'i' };
    }

    // Filtre sur etatarchivage (0 = non archivé, 1 = archivé)
    if (etatarchivage !== undefined) {
      // Convertit le paramètre en nombre (au cas où il arrive sous forme de string)
      const archivageValue = parseInt(etatarchivage, 10);
      if (!isNaN(archivageValue)) {
        filter.etatarchivage = archivageValue;
      }
    }

    console.log("🔍 Filtre utilisé :", filter);

    const clients = await Client.find(filter);
    res.json(clients);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
