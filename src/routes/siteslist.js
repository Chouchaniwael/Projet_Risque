// src/routes/siteslist.js
const express = require('express');
const router = express.Router();
const Site = require('../models/sites');

// Route pour récupérer les sites d’un client spécifique via un paramètre d’URL
router.get('/:clientNom', async (req, res) => {
  try {
    const clientNom = req.params.clientNom;
    const sites = await Site.find({ ClientNom: clientNom });
    
    res.json(sites);
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
});

module.exports = router;
