// countclient.js

const express = require("express");
const Client = require("../models/clientmodel"); // Import du modèle Client

const router = express.Router();

// Route pour obtenir le nombre de clients
router.get("/", async (req, res) => {
  try {
    const clientCount = await Client.countDocuments(); // Compte les documents (clients)
    res.json({ clientCount }); // Retourne le nombre de clients
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la récupération du nombre de clients" });
  }
});

module.exports = router;
