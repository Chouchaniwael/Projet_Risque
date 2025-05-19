const express = require('express');
const router = express.Router();
const Site = require('../models/sites');

// ✅ GET - Tous les sites d’un client
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

// ✅ GET - Un site par ID
router.get('/byId/:id', async (req, res) => {
  try {
    const siteId = req.params.id;
    const site = await Site.findById(siteId);

    if (!site) {
      return res.status(404).json({ message: "Site non trouvé." });
    }

    res.json(site);
  } catch (err) {
    console.error("❌ Erreur lors de la récupération du site :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
});

// ✅ POST - Ajouter un site
router.post('/', async (req, res) => {
  try {
    const { adresse, ClientNom, Contact, Nom, mail, etat, ouvert, Statut } = req.body;

    if (!ClientNom || !Nom) {
      return res.status(400).json({ message: 'ClientNom et Nom du site sont requis.' });
    }

    const nouveauSite = new Site({
      adresse,
      ClientNom,
      Contact,
      Nom,
      mail,
      etat: etat !== undefined ? etat : true,
      ouvert: ouvert !== undefined ? ouvert : true,
      Statut: Statut || "true",
    });

    const savedSite = await nouveauSite.save();
    res.status(201).json(savedSite);
  } catch (err) {
    console.error("❌ Erreur lors de l'ajout d’un site :", err);
    res.status(500).json({ message: "Erreur serveur lors de la création du site." });
  }
});

module.exports = router;
