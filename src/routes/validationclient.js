const express = require("express");
const router = express.Router();
const Client = require("../models/clientmodel");

// Route pour approuver un client
router.put("/:id/approve", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { Statut: true, etat: "approved" },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'approbation du client" });
  }
});

// Route pour rejeter un client
router.put("/:id/reject", async (req, res) => {
  try {
    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { Statut: false, etat: "rejected" },
      { new: true }
    );
    res.json(client);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors du rejet du client" });
  }
});

module.exports = router;
